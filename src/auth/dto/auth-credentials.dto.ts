import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'User password (min 8 characters)',
    minLength: 8,
    example: 'password123',
    required: true,
  })
  @IsString()
  @MinLength(8)
  password: string;
}
