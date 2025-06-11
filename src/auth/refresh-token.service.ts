import { Injectable } from '@nestjs/common';
import { add } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RefreshTokenService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, token: string, expiresInDays: number = 7) {
    const expiresAt = add(new Date(), { days: expiresInDays });

    return this.prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async revoke(token: string) {
    return this.prisma.refreshToken.updateMany({
      where: { token },
      data: { revoked: true },
    });
  }

  async revokeAll(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }

  async isValid(token: string) {
    const record = await this.prisma.refreshToken.findFirst({
      where: {
        token,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    return !!record;
  }

  async get(token: string) {
    return this.prisma.refreshToken.findUnique({ where: { token } });
  }
}
