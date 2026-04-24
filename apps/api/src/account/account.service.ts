import { BadRequestException, Injectable } from "@nestjs/common";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { IncomingMessage } from "http";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ChangeEmailDto } from "./dto/change-email.dto";
import { DeleteAccountDto } from "./dto/delete-account.dto";

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return { data: user };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { ...(dto.name && { name: dto.name }) },
    });
    return { data: user };
  }

  async changePassword(userId: string, dto: ChangePasswordDto, _req: IncomingMessage) {
    const account = await this.prisma.account.findFirst({
      where: { userId, providerId: "credential" },
    });
    if (!account?.password) {
      throw new BadRequestException("No password-based account found");
    }

    const valid = await verifyPassword({ hash: account.password, password: dto.currentPassword });
    if (!valid) {
      throw new BadRequestException("Invalid current password");
    }

    const newHash = await hashPassword(dto.newPassword);
    await this.prisma.account.update({
      where: { id: account.id },
      data: { password: newHash },
    });

    return { message: "Password changed successfully" };
  }

  async changeEmail(userId: string, dto: ChangeEmailDto) {
    const account = await this.prisma.account.findFirst({
      where: { userId, providerId: "credential" },
    });
    if (!account?.password) {
      throw new BadRequestException("No password-based account found");
    }

    const valid = await verifyPassword({ hash: account.password, password: dto.password });
    if (!valid) {
      throw new BadRequestException("Invalid password");
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.newEmail } });
    if (existing && existing.id !== userId) {
      throw new BadRequestException("Email is already in use");
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { email: dto.newEmail, emailVerified: false },
    });

    return { data: user };
  }

  async deleteAccount(userId: string, dto: DeleteAccountDto) {
    const account = await this.prisma.account.findFirst({
      where: { userId, providerId: "credential" },
    });
    if (!account?.password) {
      throw new BadRequestException("No password-based account found");
    }

    const valid = await verifyPassword({ hash: account.password, password: dto.password });
    if (!valid) {
      throw new BadRequestException("Invalid password");
    }

    await this.prisma.user.delete({ where: { id: userId } });
  }
}
