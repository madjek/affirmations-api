import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { User } from './decorators/user.decorator';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserPayload } from './interfaces/user-payload.interface';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({
    description: 'Returns the current user profile',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getProfile(@User() user: UserPayload): Promise<UserResponseDto> {
    return this.usersService.findOne(user.id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden - Insufficient permissions' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Get all active users' })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: UserRole,
    description: 'Filter users by role',
  })
  @ApiOkResponse({
    description: 'Returns list of users',
    type: [UserResponseDto],
  })
  async findAll(@Query('role') role?: UserRole): Promise<UserResponseDto[]> {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({
    description: 'Returns the user',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({
    description: 'The user has been successfully updated',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Forbidden - Insufficient permissions' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }
}
