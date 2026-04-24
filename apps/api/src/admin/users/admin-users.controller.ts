import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { AdminGuard } from "../../auth/guards/admin.guard";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthService } from "../../auth/auth.service";

@Controller("admin/users")
export class AdminUsersController {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  @UseGuards(AdminGuard)
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
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          banned: true,
          createdAt: true,
          image: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page: pageNum,
      pageSize: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  @UseGuards(AdminGuard)
  @Get(":userId")
  async getUser(@Param("userId") userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        banned: true,
        banReason: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        _count: { select: { members: true } },
      },
    });
    return { data: user };
  }

  @UseGuards(AdminGuard)
  @Delete(":userId")
  async deleteUser(@Param("userId") userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
    return { data: null };
  }

  @UseGuards(AdminGuard)
  @Post(":userId/impersonate")
  async impersonateUser(
    @Param("userId") userId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v != null) headers.set(k, Array.isArray(v) ? v.join(", ") : v);
    }
    const apiRes = await this.authService.auth.api.impersonateUser({
      body: { userId },
      headers,
      asResponse: true,
    });
    const setCookies = apiRes.headers.getSetCookie();
    if (setCookies.length > 0) {
      res.setHeader("set-cookie", setCookies);
    }
    return apiRes.json();
  }

  // Only requires AuthGuard (global) — impersonated sessions are not admin
  @Post("stop-impersonating")
  async stopImpersonating(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (v != null) headers.set(k, Array.isArray(v) ? v.join(", ") : v);
    }
    const apiRes = await this.authService.auth.api.stopImpersonating({
      headers,
      asResponse: true,
    });
    const setCookies = apiRes.headers.getSetCookie();
    if (setCookies.length > 0) {
      res.setHeader("set-cookie", setCookies);
    }
    return apiRes.json();
  }
}
