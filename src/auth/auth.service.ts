import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UserRole } from 'src/users/dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async register(dto: AuthCredentialsDto) {
    const { email, password, name } = dto;
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || email.split('@')[0],
        role: UserRole.USER,
      },
    });

    return this.generateTokens(user.id, user.email);
  }

  async login(dto: AuthCredentialsDto) {
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email);
  }

  async logout(userId: string) {
    await this.refreshTokenService.revokeAll(userId);

    return { message: 'Successfully logged out' };
  }

  async refresh(oldToken: string) {
    const tokenRecord = await this.refreshTokenService.get(oldToken);

    if (
      !tokenRecord ||
      tokenRecord.revoked ||
      tokenRecord.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    await this.refreshTokenService.revoke(oldToken);

    return this.generateTokens(tokenRecord.userId);
  }

  private async generateTokens(userId: string, email?: string) {
    const refreshTokenRecord = await this.prisma.refreshToken.create({
      data: {
        userId,
        token: randomUUID(),
        revoked: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });
    const payload = { id: userId, email, jti: refreshTokenRecord.id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    return { accessToken, refreshToken: refreshTokenRecord.token };
  }
}
