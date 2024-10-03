import {
  Injectable,
} from '@nestjs/common';
import { UserDTO } from 'dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'modules/users/user.service';
import { ComparePass } from 'helpers/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.validateUser(email, password);
    if (!user) return null;
    const isValidPassword = await ComparePass(password, user.password);
    if (!isValidPassword) return null;
    return user;
  }

  async login(user: UserDTO) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  register = async (registerDto: UserDTO) => {
    return this.userService.registerUser(registerDto);
  }
}
