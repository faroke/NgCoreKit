import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../../auth/guards/admin.guard";
import { PrismaService } from "../../prisma/prisma.service";
import type { Subscription } from "../../generated/prisma";

const MRR_BY_PLAN: Record<string, number> = { pro: 49, ultra: 100, free: 0 };

@UseGuards(AdminGuard)
@Controller("admin/analytics")
export class AdminAnalyticsController {
  constructor(private prisma: PrismaService) {}

  @Get("stats")
  async getStats() {
    const [userCount, orgCount, subscriptions] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.organization.count(),
      this.prisma.subscription.findMany({
        where: { status: { in: ["active", "trialing"] } },
      }),
    ]);

    const activeSubscriptions = subscriptions.length;
    const mrr = subscriptions.reduce(
      (sum: number, sub: Subscription) => sum + (MRR_BY_PLAN[sub.plan] ?? 0),
      0,
    );

    return { data: { userCount, orgCount, mrr, activeSubscriptions } };
  }
}
