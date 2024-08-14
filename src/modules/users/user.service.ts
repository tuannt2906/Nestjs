import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserDTO } from 'dto/user.dto';
import { User } from 'models/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private users: User[] = [
    {
      id: 1,
      username: "anna palestine",
      password: "hashed_password1",
      email: "anna.p@example.com",
      gender: 1,
      phonenumber: "+1234567890",
      age: 18
    },
    {
      id: 2,
      username: "robert adam",
      password: "hashed_password2",
      email: "robert.a@example.com",
      gender: 0,
      phonenumber: "+0987654321",
      age: 19
    },
  ];

  private nextId: number = this.calculateNextId();
  private readonly saltRounds = 10; // Number of bcrypt rounds for password hashing

  // Calculate the next ID based on the highest existing ID
  private calculateNextId(): number {
    return this.users.reduce((max, user) => Math.max(max, user.id), 0) + 1;
  }

  // Returns the list of all users
  getUsers(): User[] {
    return this.users;
  }

  // Hashes the password and creates a new user
  async createUser(userDTO: UserDTO): Promise<User> {
    // Check for unique username or email before creating
    if (this.users.some(user => user.username === userDTO.username)) {
      throw new ConflictException('Username already exists');
    }
    if (this.users.some(user => user.email === userDTO.email)) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userDTO.password, this.saltRounds);
    const user: User = {
      id: this.nextId++, // Assign the next sequential ID
      ...userDTO,
      password: hashedPassword, // Store the hashed password
    };
    this.users.push(user);
    return user; // Return the created user
  }

  // Retrieves user details by ID
  detailUser(id: number): any {
    const userId = id; // Convert string to number if necessary
    const user = this.users.find(item => item.id === userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user; // Return the found user
  }

  // Updates an existing user based on the provided UserDTO
  async updateUser(userDTO: UserDTO, id: number | string): Promise<User> {
    const userId = typeof id === 'string' ? parseInt(id, 10) : id; // Convert string to number if necessary
    const index = this.users.findIndex(item => item.id === userId);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }

    // Hash password if it is being updated
    const updatedUser: User = {
      ...this.users[index],
      ...userDTO,
    };
    if (userDTO.password) {
      updatedUser.password = await bcrypt.hash(userDTO.password, this.saltRounds);
    }
    this.users[index] = updatedUser;
    return updatedUser; // Return the updated user
  } 

  // Deletes a user by ID
  deleteUser(id: number | string): boolean {
    const userId = typeof id === 'string' ? parseInt(id, 10) : id; // Convert string to number if necessary
    const index = this.users.findIndex(item => item.id === userId);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(index, 1); // Remove the user from the list
    return true; // Return true to indicate successful deletion
  }
}
