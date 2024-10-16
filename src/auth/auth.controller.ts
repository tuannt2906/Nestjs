import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'customs/customize';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { UserDTO } from 'modules/users/dto/user.dto';
import { ChangePasswordAuthDto } from './dto/auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  ActivateAccountDto,
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenDto,
  TokenResponseDto,
  UserResponseDto,
} from './dto/swagger.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Fetch login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: LoginRequestDto })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh-token')
  @Public()
  @ResponseMessage('Access token refreshed')
  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Get('mail')
  @Public()
  @ApiOperation({ summary: 'Send Email' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  getMail() {
    this.mailerService.sendMail({
      to: 'nguyentuan123.yeah@gmail.com',
      subject: 'CAR ANTI THIEF ✔',
      text: 'welcome',
      template: 'mailer.hbs',
      context: {
        name: 'Tuan Nguyen',
        activationCode: 29062003,
      },
    });
    return 'Ok!';
  }

  @Post('activate')
  @Public()
  @ApiOperation({ summary: 'Activate Account' })
  @ApiResponse({ status: 200, description: 'Account activated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid activation code or expired',
  })
  @ApiBody({ type: ActivateAccountDto })
  async activateAccount(
    @Body('email') email: string,
    @Body('code') code: string,
  ) {
    const result = await this.authService.activateAccount(email, code);
    if (!result.isActive) {
      throw new BadRequestException('Invalid activation code or expired');
    }
    return {
      message: 'Account activated successfully',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'User Registration' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: UserDTO })
  async register(@Body() registerDto: UserDTO) {
    return this.authService.register(registerDto);
  }

  @Patch('change-password')
  @Public()
  @ApiOperation({ summary: 'Change Password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: ChangePasswordAuthDto })
  changePassword(@Body() data: ChangePasswordAuthDto) {
    return this.authService.changePassword(data);
  }

  @Post('logout')
  @ApiOperation({ summary: 'User Logout' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  async logout(@Request() req) {
    const userId = req.user.id;
    await this.authService.logout(userId);
  }
}
