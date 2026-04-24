import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IncomingMessage } from "http";
import { CurrentUser, type AuthenticatedUser } from "../auth/decorators/current-user.decorator";
import { AccountService } from "./account.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ChangeEmailDto } from "./dto/change-email.dto";
import { DeleteAccountDto } from "./dto/delete-account.dto";

@ApiBearerAuth()
@ApiTags("account")
@Controller("account")
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get("me")
  @ApiOperation({ summary: "Get current user profile" })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.accountService.getProfile(user.id);
  }

  @Patch("profile")
  @ApiOperation({ summary: "Update profile name" })
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.accountService.updateProfile(user.id, dto);
  }

  @Patch("change-password")
  @ApiOperation({ summary: "Change password" })
  changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
    @Req() req: IncomingMessage,
  ) {
    return this.accountService.changePassword(user.id, dto, req);
  }

  @Patch("change-email")
  @ApiOperation({ summary: "Change email address" })
  changeEmail(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangeEmailDto,
  ) {
    return this.accountService.changeEmail(user.id, dto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete account" })
  deleteAccount(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: DeleteAccountDto,
  ) {
    return this.accountService.deleteAccount(user.id, dto);
  }
}
