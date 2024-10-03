import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'customs/customize';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { UserDTO } from 'dto/user.dto';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Fetch login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto: UserDTO): Promise<User> {
    return this.authService.register(registerDto);
  }
}
