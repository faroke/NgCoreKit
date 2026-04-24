import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import type { AuthenticatedRequest } from "../decorators/current-user.decorator";

/** Platform admin guard — requires role === "admin". Applied AFTER AuthGuard. */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    if (req.user?.role !== "admin") {
      throw new ForbiddenException("Admin access required");
    }
    return true;
  }
}
