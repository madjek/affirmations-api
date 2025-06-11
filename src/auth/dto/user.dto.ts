import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/users/dto/create-user.dto';

export class UserDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: ['USER', 'ADMIN', 'MODERATOR'],
    example: 'USER',
    default: 'USER',
  })
  role: UserRole;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
    required: false,
    default: true,
  })
  active?: boolean;

  @ApiProperty({
    description: 'The date when the user was created',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'The date when the user was last updated',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  updatedAt?: Date;
}
