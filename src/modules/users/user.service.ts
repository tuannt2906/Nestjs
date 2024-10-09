import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { UserDTO } from 'modules/users/dto/user.dto';
import dayjs from 'dayjs';
import { User } from '@prisma/client';
import { ComparePass, HashPass } from 'helpers/utils';
import { PrismaService } from 'prisma.service';
import { ChangePasswordAuthDto } from 'auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findUserByUsernameOrEmail(userDTO: UserDTO) {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ username: userDTO.username }, { email: userDTO.email }],
      },
    });
  }

  async createUser(userDTO: UserDTO): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...userDTO
      },
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (!user.isActive) {
      throw new BadRequestException('Account is not activated');
    }
    if (await ComparePass(password, user.password)) {
      return user;
    }
    return null;
  }

  async detailUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(userDTO: Partial<UserDTO>, id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const dataToUpdate: Partial<UserDTO> = { ...userDTO };
    if (userDTO.password) {
      dataToUpdate.password = await HashPass(userDTO.password);
    }
    return this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async updateUserData(data: Partial<UserDTO>, userId: number): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async changePassword(data: ChangePasswordAuthDto): Promise<{ success: boolean }> {
    if (data.confirmPassword !== data.password) {
      throw new BadRequestException('Password and Confirm Password are different!');
    }
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new BadRequestException('Account does not exist!');
    }
    const hashedPassword = await HashPass(data.password);
    await this.prisma.user.update({
      where: { email: data.email },
      data: { password: hashedPassword },
    });

    return { success: true };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async findUserByRefreshToken(refreshToken: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { refreshToken },
    });
  }

  async clearRefreshToken(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}

