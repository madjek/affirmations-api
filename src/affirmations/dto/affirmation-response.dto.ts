import { ApiProperty } from '@nestjs/swagger';
import { AffirmationCategory } from '@prisma/client';

export class AffirmationResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the affirmation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The text content of the affirmation',
    example: 'I am worthy of love and respect',
  })
  text: string;

  @ApiProperty({
    description: 'The category of the affirmation',
    example: AffirmationCategory.CALMNESS,
  })
  category: AffirmationCategory;

  @ApiProperty({
    description: 'The language code of the affirmation',
    example: 'en',
  })
  language?: string;

  @ApiProperty({
    description: 'Whether the affirmation is public',
    example: true,
  })
  isPublic?: boolean;

  @ApiProperty({
    description: 'Whether the affirmation is approved by moderators',
    example: true,
  })
  isApproved?: boolean;

  @ApiProperty({
    description: 'Whether the affirmation was created by a user',
    example: true,
  })
  createdByUser: boolean;

  @ApiProperty({
    description:
      'Whether the affirmation was created by the authenticated user',
    example: true,
  })
  createdByMe?: boolean;

  @ApiProperty({
    description: 'Whether the affirmation was saved by the authenticated user',
    example: true,
  })
  saved?: boolean;

  @ApiProperty({
    description: 'The date when the affirmation was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the affirmation was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt?: Date;
}

export class AffirmationListResponseDto {
  @ApiProperty({
    description: 'An array of affirmation IDs associated with the user',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  affirmationIds: string[];
}
