import { ApiProperty } from '@nestjs/swagger';

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
    example: 'Self-love',
  })
  category: string;

  @ApiProperty({
    description: 'The language code of the affirmation',
    example: 'en',
  })
  language: string;

  @ApiProperty({
    description: 'Whether the affirmation is public',
    example: true,
  })
  isPublic: boolean;

  @ApiProperty({
    description: 'Whether the affirmation is approved by moderators',
    example: true,
  })
  isApproved: boolean;

  @ApiProperty({
    description: 'The ID of the user who created the affirmation',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  createdById: string;

  @ApiProperty({
    description: 'The date when the affirmation was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the affirmation was last updated',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class AffirmationListResponseDto {
  @ApiProperty({
    description: 'An array of affirmation IDs associated with the user',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  affirmationIds: string[];
}
