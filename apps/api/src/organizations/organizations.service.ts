import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateOrgDto } from "./dto/update-org.dto";
import { isReservedSlug, isValidSlug } from "./reserved-slugs";

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async listForUser(userId: string) {
    const members = await this.prisma.member.findMany({
      where: { userId },
      include: {
        organization: {
          include: { subscription: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return {
      data: members.map((m: (typeof members)[number]) => ({
        ...m.organization,
        role: m.role,
      })),
    };
  }

  async update(orgId: string, currentRole: string, dto: UpdateOrgDto) {
    if (!["admin", "owner"].includes(currentRole)) {
      throw new ForbiddenException("Only admins and owners can update the organization");
    }

    if (dto.slug) {
      if (!isValidSlug(dto.slug)) {
        throw new BadRequestException("Invalid slug format");
      }
      if (isReservedSlug(dto.slug)) {
        throw new BadRequestException(`"${dto.slug}" is a reserved slug`);
      }
      const existing = await this.prisma.organization.findUnique({
        where: { slug: dto.slug },
      });
      if (existing && existing.id !== orgId) {
        throw new BadRequestException("Slug is already taken");
      }
    }

    const org = await this.prisma.organization.update({
      where: { id: orgId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.slug && { slug: dto.slug }),
        ...(dto.logo !== undefined && { logo: dto.logo }),
      },
    });

    return { data: org };
  }

  async delete(orgId: string, currentRole: string) {
    if (currentRole !== "owner") {
      throw new ForbiddenException("Only owners can delete the organization");
    }
    await this.prisma.organization.delete({ where: { id: orgId } });
  }
}
