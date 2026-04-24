import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export type OrgContext = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  metadata: string | null;
  stripeCustomerId: string | null;
  email: string | null;
  currentUserRole: string;
};

export type OrgRequest = { org: OrgContext };

/** Extract the current org from the request (set by OrgGuard). */
export const CurrentOrg = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): OrgContext => {
    return ctx.switchToHttp().getRequest<OrgRequest>().org;
  },
);
