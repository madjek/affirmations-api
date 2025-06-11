import { ApiProperty } from '@nestjs/swagger';
import { AffirmationCategory } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAffirmationDto {
  @ApiProperty({
    description: 'The text content of the affirmation',
    example: 'I am worthy of love and respect',
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({
    description: 'The category of the affirmation',
    example: 'Self-love',
  })
  @IsNotEmpty()
  @IsEnum(AffirmationCategory, { message: 'Invalid affirmation category' })
  category: AffirmationCategory;

  @ApiProperty({
    description: 'The language of the affirmation',
    example: 'en',
  })
  @IsNotEmpty()
  @IsString()
  language: string;

  @ApiProperty({
    description: 'Whether the affirmation is public',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
