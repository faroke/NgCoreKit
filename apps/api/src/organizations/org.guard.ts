import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthenticatedRequest } from "../auth/decorators/current-user.decorator";
import type { OrgRequest } from "../auth/decorators/current-org.decorator";

@Injectable()
export class OrgGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest & OrgRequest & { params: Record<string, string> }>();
    const orgSlug = req.params["orgSlug"];

    if (!orgSlug) return true; // Guard only applies when :orgSlug is present

    const org = await this.prisma.organization.findUnique({
      where: { slug: orgSlug },
      include: {
        members: {
          where: { userId: req.user.id },
          select: { role: true },
        },
      },
    });

    if (!org) throw new NotFoundException(`Organization "${orgSlug}" not found`);

    const membership = org.members[0];
    if (!membership) throw new ForbiddenException("You are not a member of this organization");

    req.org = {
      id: org.id,
      name: org.name,
      slug: org.slug ?? orgSlug,
      logo: org.logo ?? null,
      metadata: org.metadata ?? null,
      stripeCustomerId: org.stripeCustomerId ?? null,
      email: org.email ?? null,
      currentUserRole: membership.role,
    };

    return true;
  }
}
