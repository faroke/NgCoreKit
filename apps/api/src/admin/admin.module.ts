import { Module } from "@nestjs/common";
import { AdminAnalyticsController } from "./analytics/admin-analytics.controller";
import { AdminUsersController } from "./users/admin-users.controller";
import { AdminOrgsController } from "./organizations/admin-orgs.controller";
import { AdminFeedbackController } from "./feedback/admin-feedback.controller";
import { AuthModule } from "../auth/auth.module";
import { FeedbackModule } from "../feedback/feedback.module";

@Module({
  imports: [AuthModule, FeedbackModule],
  controllers: [
    AdminAnalyticsController,
    AdminUsersController,
    AdminOrgsController,
    AdminFeedbackController,
  ],
})
export class AdminModule {}
