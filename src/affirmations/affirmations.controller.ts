import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDto } from 'src/auth/dto/user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/decorators/user.decorator';
import { AffirmationsService } from './affirmations.service';
import { AffirmationResponseDto } from './dto/affirmation-response.dto';
import { CreateAffirmationDto } from './dto/create-affirmation.dto';

@ApiTags('Affirmations')
@Controller('affirmations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AffirmationsController {
  constructor(private readonly affirmationsService: AffirmationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new affirmation' })
  @ApiCreatedResponse({
    description: 'The affirmation has been successfully created',
    type: AffirmationResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({ type: CreateAffirmationDto })
  async create(
    @User() user: UserDto,
    @Body() createAffirmationDto: CreateAffirmationDto,
  ) {
    return this.affirmationsService.createAffirmation(
      user.id,
      createAffirmationDto,
    );
  }

  @Get('public/:language')
  @ApiOperation({ summary: 'Get all public affirmations' })
  @ApiOkResponse({
    description: 'Returns list of public affirmations',
    type: [AffirmationResponseDto],
  })
  async getPublicAffirmations(
    @Param('language') language: string,
    @User() user: UserDto,
  ) {
    return this.affirmationsService.getPublicAffirmations(language, user.id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get all public affirmations' })
  @ApiOkResponse({
    description: 'Returns list of public affirmations',
    type: [AffirmationResponseDto],
  })
  async getMyAffirmations(@User() user: UserDto) {
    return this.affirmationsService.getMyAffirmations(user.id);
  }

  @Post('share/:id')
  @ApiOperation({ summary: 'Share an affirmation' })
  @ApiParam({ name: 'id', description: 'Affirmation ID' })
  @ApiOkResponse({
    description: 'The affirmation has been successfully shared',
    type: AffirmationResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Affirmation not found' })
  async shareAffirmation(@Param('id') id: string, @User() user: UserDto) {
    return this.affirmationsService.shareAffirmation(id, user.id);
  }

  @Post('save/:id')
  @ApiOperation({ summary: 'Save an affirmation to your collection' })
  @ApiParam({ name: 'id', description: 'Affirmation ID' })
  @ApiOkResponse({
    description:
      'The affirmation has been successfully saved to your collection',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Affirmation not found' })
  async saveAffirmation(@Param('id') id: string, @User() user: UserDto) {
    return this.affirmationsService.saveAffirmation(id, user.id);
  }

  @Post('unsave/:id')
  @ApiOperation({ summary: 'Unsave an affirmation from your collection' })
  @ApiParam({ name: 'id', description: 'Affirmation ID' })
  @ApiOkResponse({
    description:
      'The affirmation has been successfully unsaved from your collection',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Affirmation not found' })
  async unsaveAffirmation(@Param('id') id: string, @User() user: UserDto) {
    return this.affirmationsService.unsaveAffirmation(id, user.id);
  }
}
