import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { OrganizationsModule } from "../organizations/organizations.module";
import { BillingService } from "./billing.service";
import { BillingController } from "./billing.controller";
import { WebhooksController } from "./webhooks.controller";
import { STRIPE_CLIENT } from "./billing.constants";

@Module({
  imports: [OrganizationsModule],
  providers: [
    BillingService,
    {
      provide: STRIPE_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Stripe(config.getOrThrow<string>("STRIPE_SECRET_KEY")),
    },
  ],
  controllers: [BillingController, WebhooksController],
})
export class BillingModule {}
