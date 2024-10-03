import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { UserDTO } from 'dto/user.dto';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@prisma/client';
import { ComparePass, HashPass } from 'helpers/utils'; // Import HashPass
import { PrismaService } from 'prisma.service';
import { ChangePasswordAuthDto } from 'auth/dto/auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  private async checkUserExists(userDTO: UserDTO): Promise<void> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: userDTO.username }, { email: userDTO.email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === userDTO.username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.email === userDTO.email) {
        throw new ConflictException('Email already exists');
      }
    }
  }

  async registerUser(userDTO: UserDTO): Promise<{ id: number }> {
    await this.checkUserExists(userDTO);
    const hashedPassword = await HashPass(userDTO.password);
    const codeID = uuidv4();
    const user = await this.prisma.user.create({
      data: {
        ...userDTO,
        password: hashedPassword,
        isActive: false,
        codeId: codeID,
        codeExpired: dayjs().add(5, 'minutes').toDate(),
      },
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

  async createUser(userDTO: UserDTO): Promise<User> {
    await this.checkUserExists(userDTO);
    const hashedPassword = await HashPass(userDTO.password);
    return this.prisma.user.create({
      data: {
        ...userDTO,
        password: hashedPassword,
        isActive: true,
      },
    });
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

  async updateUser(userDTO: UserDTO, id: number): Promise<User> {
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

  async deleteUser(id: number): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async changePassword(
    data: ChangePasswordAuthDto,
  ): Promise<{ success: boolean }> {
    if (data.confirmPassword !== data.password) {
      throw new BadRequestException(
        'Password and Confirm Password are different!',
      );
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
}
