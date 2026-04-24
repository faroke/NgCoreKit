import { Module } from "@nestjs/common";
import { OrganizationsController } from "./organizations.controller";
import { OrganizationsService } from "./organizations.service";
import { OrgGuard } from "./org.guard";

@Module({
  providers: [OrganizationsService, OrgGuard],
  controllers: [OrganizationsController],
  exports: [OrgGuard],
})
export class OrganizationsModule {}
