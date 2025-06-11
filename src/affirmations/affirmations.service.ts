import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAffirmationDto } from './dto/create-affirmation.dto';

@Injectable()
export class AffirmationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createAffirmationDto: CreateAffirmationDto) {
    return this.prisma.affirmation.create({
      data: {
        ...createAffirmationDto,
        createdById: userId,
      },
    });
  }

  async getPublicAffirmations(language: string) {
    const affirmations = await this.prisma.affirmation.findMany({
      where: {
        isPublic: true,
        isApproved: true,
        language,
      },
      select: {
        id: true,
        text: true,
        category: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return affirmations;
  }

  async shareAffirmation(id: string, userId: string) {
    const affirmation = await this.prisma.affirmation.findUnique({
      where: { id },
      include: { createdBy: true },
    });

    if (!affirmation) {
      throw new NotFoundException('Affirmation not found');
    }

    if (affirmation.createdById !== userId) {
      throw new UnauthorizedException(
        'You can only share your own affirmations',
      );
    }

    return this.prisma.affirmation.update({
      where: { id },
      data: {
        isPublic: true,
        isApproved: false, // Requires moderation
      },
    });
  }

  async getSharedByMe(userId: string) {
    return this.prisma.affirmation.findMany({
      where: {
        createdById: userId,
        isPublic: true,
        isApproved: true,
      },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
