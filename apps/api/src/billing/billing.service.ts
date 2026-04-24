import { Inject, Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { PrismaService } from "../prisma/prisma.service";
import { OrgContext } from "../auth/decorators/current-org.decorator";
import { BILLING_PLANS, getPlanByName, getPlanByPriceId } from "./billing-plans";
import type { BillingPlanPublic, OrgSubscription, OrgInvoice } from "@ngcorekit/types";
import { STRIPE_CLIENT } from "./billing.constants";

@Injectable()
export class BillingService {
  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
    private prisma: PrismaService,
  ) {}

  async getOrCreateStripeCustomer(org: OrgContext): Promise<string> {
    if (org.stripeCustomerId) return org.stripeCustomerId;

    const customer = await this.stripe.customers.create({
      name: org.name,
      email: org.email ?? undefined,
      metadata: { orgId: org.id, orgSlug: org.slug },
    });

    await this.prisma.organization.update({
      where: { id: org.id },
      data: { stripeCustomerId: customer.id },
    });

    return customer.id;
  }

  async getSubscription(orgId: string): Promise<OrgSubscription | null> {
    const sub = await this.prisma.subscription.findUnique({
      where: { referenceId: orgId },
    });

    if (!sub) return null;

    return {
      id: sub.id,
      plan: sub.plan as OrgSubscription["plan"],
      status: sub.status as OrgSubscription["status"],
      periodStart: sub.periodStart?.toISOString() ?? null,
      periodEnd: sub.periodEnd?.toISOString() ?? null,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? null,
      seats: sub.seats ?? null,
    };
  }

  getPlans(): BillingPlanPublic[] {
    return BILLING_PLANS.map(({ name, description, price, yearlyPrice, currency, isPopular, limits }) => ({
      name,
      description,
      price,
      yearlyPrice,
      currency,
      isPopular,
      limits,
    }));
  }

  async createCheckoutSession(
    org: OrgContext,
    plan: "pro" | "ultra",
    interval: "monthly" | "yearly",
    successUrl: string,
    cancelUrl: string,
  ): Promise<string> {
    const customerId = await this.getOrCreateStripeCustomer(org);
    const planConfig = getPlanByName(plan);
    if (!planConfig) throw new Error(`Unknown plan: ${plan}`);

    const priceId = interval === "yearly" ? planConfig.annualPriceId : planConfig.priceId;
    if (!priceId) throw new Error(`Price ID not configured for ${plan} ${interval}`);

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { orgId: org.id },
      subscription_data: { metadata: { orgId: org.id } },
    };

    if (planConfig.freeTrial?.days) {
      sessionParams.subscription_data = {
        ...sessionParams.subscription_data,
        trial_period_days: planConfig.freeTrial.days,
      };
    }

    const session = await this.stripe.checkout.sessions.create(sessionParams);
    return session.url!;
  }

  async createPortalSession(org: OrgContext, returnUrl: string): Promise<string> {
    const customerId = await this.getOrCreateStripeCustomer(org);
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session.url;
  }

  async getInvoices(org: OrgContext): Promise<OrgInvoice[]> {
    const customerId = await this.getOrCreateStripeCustomer(org);
    const invoices = await this.stripe.invoices.list({
      customer: customerId,
      limit: 24,
    });

    return invoices.data.map((inv) => ({
      id: inv.id,
      number: inv.number ?? null,
      status: inv.status ?? null,
      amountPaid: inv.amount_paid,
      currency: inv.currency,
      periodStart: new Date((inv.period_start ?? 0) * 1000).toISOString(),
      periodEnd: new Date((inv.period_end ?? 0) * 1000).toISOString(),
      hostedInvoiceUrl: inv.hosted_invoice_url ?? null,
      pdfUrl: inv.invoice_pdf ?? null,
    }));
  }

  async handleSubscriptionUpsert(stripeSubscription: Stripe.Subscription): Promise<void> {
    const orgId = stripeSubscription.metadata?.["orgId"];
    if (!orgId) return;

    const priceId = stripeSubscription.items.data[0]?.price?.id ?? "";
    const planConfig = getPlanByPriceId(priceId);
    const planName = planConfig?.name ?? "free";

    const periodStart = stripeSubscription.items.data[0]?.current_period_start
      ? new Date(stripeSubscription.items.data[0].current_period_start * 1000)
      : null;
    const periodEnd = stripeSubscription.items.data[0]?.current_period_end
      ? new Date(stripeSubscription.items.data[0].current_period_end * 1000)
      : null;

    const subData = {
      plan: planName,
      stripeCustomerId: stripeSubscription.customer as string,
      stripeSubscriptionId: stripeSubscription.id,
      status: stripeSubscription.status,
      periodStart,
      periodEnd,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    };

    await this.prisma.subscription.upsert({
      where: { referenceId: orgId },
      update: subData,
      create: { id: `sub_${Date.now()}`, referenceId: orgId, ...subData },
    });
  }

  async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription): Promise<void> {
    const orgId = stripeSubscription.metadata?.["orgId"];
    if (!orgId) return;

    await this.prisma.subscription.upsert({
      where: { referenceId: orgId },
      update: { plan: "free", status: "canceled", stripeSubscriptionId: null },
      create: {
        id: `sub_${Date.now()}`,
        referenceId: orgId,
        plan: "free",
        status: "canceled",
        stripeCustomerId: stripeSubscription.customer as string,
        stripeSubscriptionId: null,
      },
    });
  }

  async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const subscriptionId = session.subscription as string | null;
    if (!subscriptionId) return;

    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
    await this.handleSubscriptionUpsert(subscription);
  }
}
