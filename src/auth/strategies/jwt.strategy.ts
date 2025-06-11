import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
      passReqToCallback: false,
    });
  }

  async validate(payload: { id: string; email?: string; jti: string }) {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { id: payload.jti },
    });

    if (!refreshToken || refreshToken.revoked) {
      throw new UnauthorizedException('Access token is invalid or revoked');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { id: user.id };
  }
}
