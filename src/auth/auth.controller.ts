import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'customs/customize';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { UserDTO } from 'modules/users/dto/user.dto';
import { ChangePasswordAuthDto } from './dto/auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

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
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('mail')
  @Public()
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

  @Post('register')
  @Public()
  async register(@Body() registerDto: UserDTO) {
    return this.authService.register(registerDto);
  }

  @Patch('change-password')
  @Public()
  changePassword(@Body() data: ChangePasswordAuthDto) {
    return this.authService.changePassword(data);
  }
}
