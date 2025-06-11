import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AffirmationsController } from './affirmations.controller';
import { AffirmationsService } from './affirmations.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AffirmationsController],
  providers: [AffirmationsService],
})
export class AffirmationsModule {}
