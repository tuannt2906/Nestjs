import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { UserDTO } from 'dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@prisma/client';
import { ComparePass, HashPass } from 'helpers/utils'; // Import HashPass
import { PrismaService } from 'prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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

  async registerUser(userDTO: UserDTO): Promise<User> {
    await this.checkUserExists(userDTO);
    const hashedPassword = await HashPass(userDTO.password);
    return this.prisma.user.create({
      data: {
        ...userDTO,
        password: hashedPassword,
        isActive: false,
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
}
