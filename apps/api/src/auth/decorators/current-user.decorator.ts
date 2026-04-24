import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { IncomingMessage } from "http";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string | null;
};

export type AuthenticatedRequest = IncomingMessage & {
  user: AuthenticatedUser;
  session: { id: string; activeOrganizationId: string | null };
};

/** Extract the current authenticated user from the request. */
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return req.user;
  },
);

/** Extract the current session from the request. */
export const CurrentSession = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return req.session;
  },
);
