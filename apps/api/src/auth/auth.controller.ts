import { All, Controller, Req, Res } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { IncomingMessage, ServerResponse } from "http";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";

/**
 * Wildcard controller that delegates all /api/auth/** requests to Better Auth.
 * Better Auth handles its own request/response lifecycle.
 */
@ApiExcludeController()
@Public()
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @All("*")
  async handleAuth(
    @Req() req: IncomingMessage,
    @Res() res: ServerResponse,
  ) {
    return this.authService.handler(req, res);
  }
}
