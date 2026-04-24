import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { OrgGuard } from "../organizations/org.guard";
import { CurrentOrg } from "../auth/decorators/current-org.decorator";
import type { OrgContext } from "../auth/decorators/current-org.decorator";
import { BillingService } from "./billing.service";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";
import type { OrgSubscription, OrgInvoice, BillingPlanPublic, CheckoutResponse, PortalResponse } from "@ngcorekit/types";
import { ConfigService } from "@nestjs/config";

@Controller("orgs/:orgSlug/billing")
@UseGuards(OrgGuard)
export class BillingController {
  constructor(
    private billingService: BillingService,
    private config: ConfigService,
  ) {}

  @Get("subscription")
  async getSubscription(@CurrentOrg() org: OrgContext): Promise<{ data: OrgSubscription | null }> {
    const subscription = await this.billingService.getSubscription(org.id);
    return { data: subscription };
  }

  @Get("plans")
  getPlans(): { data: BillingPlanPublic[] } {
    return { data: this.billingService.getPlans() };
  }

  @Get("invoices")
  async getInvoices(@CurrentOrg() org: OrgContext): Promise<{ data: OrgInvoice[] }> {
    const invoices = await this.billingService.getInvoices(org);
    return { data: invoices };
  }

  @Post("checkout")
  @HttpCode(HttpStatus.OK)
  async createCheckout(
    @CurrentOrg() org: OrgContext,
    @Body() dto: CreateCheckoutDto,
  ): Promise<CheckoutResponse> {
    const webUrl = this.config.get<string>("WEB_URL") ?? "http://localhost:4200";
    const successUrl = `${webUrl}/orgs/${org.slug}/settings/billing?checkout=success`;
    const cancelUrl = `${webUrl}/orgs/${org.slug}/settings/billing`;

    const url = await this.billingService.createCheckoutSession(
      org,
      dto.plan,
      dto.interval,
      successUrl,
      cancelUrl,
    );
    return { url };
  }

  @Post("portal")
  @HttpCode(HttpStatus.OK)
  async createPortal(@CurrentOrg() org: OrgContext): Promise<PortalResponse> {
    const webUrl = this.config.get<string>("WEB_URL") ?? "http://localhost:4200";
    const returnUrl = `${webUrl}/orgs/${org.slug}/settings/billing`;
    const url = await this.billingService.createPortalSession(org, returnUrl);
    return { url };
  }
}
