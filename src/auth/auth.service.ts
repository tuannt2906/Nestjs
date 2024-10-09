import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
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
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.validateUser(email, password);
    if (!user) return null;
    const isValidPassword = await ComparePass(password, user.password);
    if (!isValidPassword) return null;
    return user;
  }

  async login(
    user: UserDTO,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { email: user.email, sub: user.id };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED || '15m',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED || '7d',
    });

    await this.userService.updateUser(
      { refreshToken: refresh_token },
      user.id as number,
    );

    return {
      access_token,
      refresh_token,
    };
  }

  async logout(userId: number): Promise<void> {
    await this.userService.clearRefreshToken(userId);
  }  

  async register(registerDto: UserDTO): Promise<{ id: number }> {
    await this.checkUserExists(registerDto);
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
      template: 'mailer.hbs',
      context: {
        name: user.username || user.email,
        activationCode: codeID,
      },
    });

    return { id: user.id };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserByEmail(payload.email);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const access_token = this.jwtService.sign(
        { email: payload.email, sub: payload.sub },
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED || '15m' },
      );

      const new_refresh_token = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED || '7d',
      });

      await this.userService.saveRefreshToken(user.id, new_refresh_token);

      return {
        access_token,
        refresh_token: new_refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async checkUserExists(userDTO: UserDTO): Promise<void> {
    const existingUser =
      await this.userService.findUserByUsernameOrEmail(userDTO);
    if (existingUser) {
      if (existingUser.username === userDTO.username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.email === userDTO.email) {
        throw new ConflictException('Email already exists');
      }
    }
  }

  async activateAccount(email: string, code: string): Promise<boolean> {
    const user = await this.userService.findUserByEmail(email);

    if (!user || user.codeId !== code || dayjs().isAfter(user.codeExpired)) {
      return false;
    }

    await this.userService.updateUser({ isActive: true }, user.id);
    return true;
  }

  async changePassword(data: ChangePasswordAuthDto) {
    return this.userService.changePassword(data);
  }
}
