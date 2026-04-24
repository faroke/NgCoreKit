import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFeedbackDto, userId?: string) {
    const feedback = await this.prisma.feedback.create({
      data: { ...dto, userId: userId ?? null },
    });
    return { data: feedback };
  }

  async list(page: number, pageSize: number, status?: string) {
    const skip = (page - 1) * pageSize;
    const where = status ? { status } : {};
    const [items, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.feedback.count({ where }),
    ]);
    return {
      data: items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return { data: feedback };
  }

  async update(id: string, dto: UpdateFeedbackDto) {
    const feedback = await this.prisma.feedback.update({
      where: { id },
      data: dto,
    });
    return { data: feedback };
  }
}
