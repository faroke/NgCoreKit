import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { TerminusModule } from "@nestjs/terminus";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthGuard } from "./auth/guards/auth.guard";
import { AuthModule } from "./auth/auth.module";
import { HealthController } from "./health/health.controller";
import { OrganizationsModule } from "./organizations/organizations.module";
import { PrismaModule } from "./prisma/prisma.module";
import { BillingModule } from "./billing/billing.module";
import { FeedbackModule } from "./feedback/feedback.module";
import { AdminModule } from "./admin/admin.module";
import { SupportModule } from "./support/support.module";
import { SeoModule } from "./seo/seo.module";
import { AccountModule } from "./account/account.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TerminusModule,
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    BillingModule,
    FeedbackModule,
    AdminModule,
    SupportModule,
    SeoModule,
    AccountModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
