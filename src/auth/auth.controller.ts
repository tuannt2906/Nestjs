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
import { UserDTO } from 'dto/user.dto';
import { User } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';
import { ChangePasswordAuthDto } from './dto/auth.dto';

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
      to: 'nguyentuan123.yeah@gmail.com', // list of receivers
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome', // plaintext body
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
  async register(@Body() registerDto: UserDTO): Promise<User> {
    return this.authService.register(registerDto);
  }

  @Patch('change-password')
  @Public()
  changePassword(@Body() data: ChangePasswordAuthDto) {
    return this.authService.changePassword(data);
  }
}
