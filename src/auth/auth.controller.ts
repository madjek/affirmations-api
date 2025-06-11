import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from 'src/users/decorators/user.decorator';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: UserDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({
    description: 'User already exists',
  })
  @ApiBody({ type: AuthCredentialsDto })
  async register(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.register(authCredentialsDto);
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({
    description: 'User successfully logged in',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @ApiBody({ type: AuthCredentialsDto })
  async login(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.login(authCredentialsDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiOkResponse({
    description: 'User successfully logged out',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async logout(@User() user: UserDto) {
    return this.authService.logout(user.id);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiBody({ schema: { example: { refreshToken: 'uuid-token' } } })
  @ApiOkResponse({ description: 'Tokens refreshed' })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
}
