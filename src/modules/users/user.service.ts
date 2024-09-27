import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserDTO } from 'dto/user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma.service';

@Injectable()
export class UserService {
  private readonly saltRounds = 10;

  constructor(private readonly prisma: PrismaService) {}

  // Returns the list of all users
  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // Hashes the password and creates a new user
  async createUser(userDTO: UserDTO): Promise<User> {
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

    const hashedPassword = await bcrypt.hash(userDTO.password, this.saltRounds);
    return this.prisma.user.create({
      data: {
        ...userDTO,
        password: hashedPassword,
      },
    });
  }

  // Retrieves user details by ID
  async detailUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Updates an existing user based on the provided UserDTO
  async updateUser(userDTO: UserDTO, id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const dataToUpdate: Partial<UserDTO> = { ...userDTO };
    if (userDTO.password) {
      dataToUpdate.password = await bcrypt.hash(
        userDTO.password,
        this.saltRounds,
      );
    }
    return this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  // Deletes a user by ID
  async deleteUser(id: number): Promise<boolean> {
    const user = await this.prisma.user.delete({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return true;
  }
}
