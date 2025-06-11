import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (min 6 characters)',
    minLength: 6,
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
