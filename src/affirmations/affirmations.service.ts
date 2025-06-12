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

  async createAffirmation(
    userId: string,
    createAffirmationDto: CreateAffirmationDto,
  ) {
    return this.prisma.affirmation.create({
      data: {
        ...createAffirmationDto,
        createdById: userId,
      },
    });
  }

  async getPublicAffirmations(language: string, userId: string) {
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
        createdById: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return affirmations.map(({ createdById, ...rest }) => ({
      ...rest,
      createdByUser: !!createdById,
      createdByMe: createdById === userId,
    }));
  }

  async getMyAffirmations(userId: string) {
    const created = await this.prisma.affirmation.findMany({
      where: {
        createdById: userId,
      },
      select: {
        id: true,
        text: true,
        category: true,
        language: true,
        createdAt: true,
        isPublic: true,
        isApproved: true,
      },
    });
    const saved = await this.prisma.savedAffirmation.findMany({
      where: {
        userId,
      },
      select: {
        affirmation: {
          select: {
            id: true,
            text: true,
            category: true,
            language: true,
            createdAt: true,
          },
        },
      },
    });
    const savedAffirmations = saved.map((entry) => ({
      ...entry.affirmation,
      saved: true,
    }));
    const createdAffirmations = created.map((a) => ({
      ...a,
      saved: false,
    }));
    const combinedMap = new Map<string, (typeof savedAffirmations)[0]>();

    for (const a of [...createdAffirmations, ...savedAffirmations]) {
      combinedMap.set(a.id as string, a);
    }

    return Array.from(combinedMap.values());
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

  async saveAffirmation(id: string, userId: string): Promise<void> {
    const affirmation = await this.prisma.affirmation.findUnique({
      where: { id },
    });

    if (!affirmation) {
      throw new NotFoundException('Affirmation not found');
    }

    await this.prisma.savedAffirmation.create({
      data: {
        userId,
        affirmationId: id,
      },
    });
  }

  async unsaveAffirmation(id: string, userId: string): Promise<void> {
    const affirmation = await this.prisma.affirmation.findUnique({
      where: { id },
    });

    if (!affirmation) {
      throw new NotFoundException('Affirmation not found');
    }

    await this.prisma.savedAffirmation.deleteMany({
      where: {
        userId,
        affirmationId: id,
      },
    });
  }
}
