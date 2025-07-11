import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AffirmationsModule } from './affirmations/affirmations.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    AffirmationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
