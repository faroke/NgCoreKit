import { Controller, Inject, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import Stripe from "stripe";
import { ConfigService } from "@nestjs/config";
import { Public } from "../auth/decorators/public.decorator";
import { BillingService } from "./billing.service";
import { STRIPE_CLIENT } from "./billing.constants";

interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

@Controller("webhooks")
export class WebhooksController {
  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
    private billingService: BillingService,
    private config: ConfigService,
  ) {}

  @Public()
  @Post("stripe")
  async handleStripeWebhook(
    @Req() req: RawBodyRequest,
    @Res() res: Response,
  ): Promise<void> {
    const sig = req.headers["stripe-signature"] as string | undefined;
    const webhookSecret = this.config.getOrThrow<string>("STRIPE_WEBHOOK_SECRET");

    let event: Stripe.Event;
    try {
      if (!req.rawBody) {
        res.status(400).send("Missing raw body");
        return;
      }
      event = this.stripe.webhooks.constructEvent(req.rawBody, sig ?? "", webhookSecret);
    } catch {
      res.status(400).send("Webhook signature verification failed");
      return;
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
          await this.billingService.handleCheckoutCompleted(
            event.data.object as Stripe.Checkout.Session,
          );
          break;
        case "customer.subscription.updated":
          await this.billingService.handleSubscriptionUpsert(
            event.data.object as Stripe.Subscription,
          );
          break;
        case "customer.subscription.deleted":
          await this.billingService.handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription,
          );
          break;
        default:
          break;
      }
      res.json({ ok: true });
    } catch {
      res.status(500).json({ ok: false });
    }
  }
}
