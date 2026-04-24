import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentOrg } from "../auth/decorators/current-org.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/decorators/current-user.decorator";
import type { OrgContext } from "../auth/decorators/current-org.decorator";
import { OrgGuard } from "./org.guard";
import { OrganizationsService } from "./organizations.service";
import { UpdateOrgDto } from "./dto/update-org.dto";

@ApiBearerAuth()
@ApiTags("organizations")
@Controller("orgs")
export class OrganizationsController {
  constructor(private orgsService: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: "List current user organizations" })
  listMyOrgs(@CurrentUser() user: AuthenticatedUser) {
    return this.orgsService.listForUser(user.id);
  }

  @Get(":orgSlug")
  @UseGuards(OrgGuard)
  @ApiOperation({ summary: "Get organization by slug" })
  getOrg(@CurrentOrg() org: OrgContext) {
    return { data: org };
  }

  @Patch(":orgSlug")
  @UseGuards(OrgGuard)
  @ApiOperation({ summary: "Update organization" })
  updateOrg(
    @CurrentOrg() org: OrgContext,
    @Body() dto: UpdateOrgDto,
  ) {
    return this.orgsService.update(org.id, org.currentUserRole, dto);
  }

  @Delete(":orgSlug")
  @UseGuards(OrgGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete organization" })
  deleteOrg(@CurrentOrg() org: OrgContext) {
    return this.orgsService.delete(org.id, org.currentUserRole);
  }
}
