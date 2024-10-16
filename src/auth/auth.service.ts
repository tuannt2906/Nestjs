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
import { log } from 'console';

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
    console.log(user);

    const payload = { email: user.email, sub: user.id };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED,
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED,
    });
    await this.userService.updateUser(
      {
        refreshToken: refresh_token,
        refreshTokenExpired: dayjs().add(7, 'days').toDate(),
      },
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

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokenExpired = dayjs().isAfter(user.refreshTokenExpired);

      if (tokenExpired) {
        throw new UnauthorizedException('Refresh token expired');
      }

      const access_token = this.jwtService.sign(
        { email: payload.email, sub: payload.sub },
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED},
      );

      const new_refresh_token = await this.jwtService.signAsync(
        {
          email: payload.email,
          sub: payload.sub,
        },
        {
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED,
        },
      );

      await this.userService.updateUser(
        {
          refreshToken: new_refresh_token,
          refreshTokenExpired: dayjs().add(7, 'days').toDate(),
        },
        user.id,
      );

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

  private async createRefreshToken(userId: number): Promise<string> {
    const payload = { sub: userId };
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED,
    });
    await this.userService.updateUser(
      {
        refreshToken: refreshToken,
        refreshTokenExpired: dayjs().add(7, 'days').toDate(),
      },
      userId,
    );
    return refreshToken;
  }

  async activateAccount(
    email: string,
    code: string,
  ): Promise<{
    isActive: boolean;
    accessToken: string | null;
    refreshToken: string | null;
  }> {
    const user = await this.userService.findUserByEmail(email);
    if (!user || user.codeId !== code || dayjs().isAfter(user.codeExpired)) {
      return { isActive: false, accessToken: null, refreshToken: null };
    }
    await this.userService.updateUser({ isActive: true }, user.id);
    const refreshToken = await this.createRefreshToken(user.id);
    await this.userService.updateUser(
      {
        refreshToken: refreshToken,
        refreshTokenExpired: dayjs().add(7, 'days').toDate(),
      },
      user.id,
    );
    const accessToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED},
    );

    return { isActive: true, accessToken, refreshToken };
  }

  async changePassword(data: ChangePasswordAuthDto) {
    return this.userService.changePassword(data);
  }
}
