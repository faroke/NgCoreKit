import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { IsOptional, IsString } from "class-validator";
import { AdminGuard } from "../../auth/guards/admin.guard";
import { PrismaService } from "../../prisma/prisma.service";

class AdminUpdateOrgDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  metadata?: string;
}

@UseGuards(AdminGuard)
@Controller("admin/organizations")
export class AdminOrgsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(
    @Query("page") page = "1",
    @Query("limit") limit = "20",
    @Query("search") search?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [orgs, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        include: {
          subscription: true,
          _count: { select: { members: true } },
        },
      }),
      this.prisma.organization.count({ where }),
    ]);

    return {
      data: orgs.map((org: (typeof orgs)[number]) => ({
        ...org,
        memberCount: org._count.members,
      })),
      total,
      page: pageNum,
      pageSize: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  @Get(":orgId")
  async getOrg(@Param("orgId") orgId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        subscription: true,
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    return { data: org };
  }

  @Patch(":orgId")
  async updateOrg(@Param("orgId") orgId: string, @Body() dto: AdminUpdateOrgDto) {
    const org = await this.prisma.organization.update({
      where: { id: orgId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.metadata !== undefined && { metadata: dto.metadata }),
      },
    });
    return { data: org };
  }

  @Delete(":orgId/members/:memberId")
  async removeMember(
    @Param("orgId") orgId: string,
    @Param("memberId") memberId: string,
  ) {
    await this.prisma.member.delete({
      where: { id: memberId, organizationId: orgId },
    });
    return { data: null };
  }
}
