import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UserDTO } from 'modules/users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'modules/users/user.service';
import { ComparePass, HashPass } from 'helpers/utils';
import { ChangePasswordAuthDto } from './dto/auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService, // Thêm mailerService vào constructor
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

  async register(registerDto: UserDTO): Promise<{ id: number }> {
    await this.checkUserExists(registerDto); // Gọi checkUserExists
    const hashedPassword = await HashPass(registerDto.password);
    const codeID = uuidv4();
    
    const user = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
      isActive: false,
      codeId: codeID,
      codeExpired: dayjs().add(5, 'minutes').toDate(),
    });

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account',
      text: 'Welcome',
      template: 'mailer.hbs',
      context: {
        name: user.username || user.email,
        activationCode: codeID,
      },
    });

    return {
      id: user.id,
    };
  }

  private async checkUserExists(userDTO: UserDTO): Promise<void> {
    const existingUser = await this.userService.findUserByUsernameOrEmail(userDTO);
    
    if (existingUser) {
      if (existingUser.username === userDTO.username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.email === userDTO.email) {
        throw new ConflictException('Email already exists');
      }
    }
  }

  async changePassword(data: ChangePasswordAuthDto) {
    return this.userService.changePassword(data);
  }
}
