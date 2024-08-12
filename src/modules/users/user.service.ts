import { Injectable } from '@nestjs/common';
import { UserDTO } from 'dto/user.dto';
import { User } from 'models/user.model';

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

  // Returns the list of all users
  getUsers(): User[] {
    return this.users;
  }

  // Creates a new user and adds it to the list
  createUser(userDTO: UserDTO): User {
    const user: User = {
      id: Math.random(), // Generate a random ID for the new user
      ...userDTO
    };
    this.users.push(user);
    return user; // Return the created user
  }

  // Retrieves user details by ID
  detailUser(id: number): User | null {
    const user = this.users.find(item => item.id === Number(id));
    return user || null; // Return null if user not found
  }

  // Updates an existing user based on the provided UserDTO
  updateUser(userDTO: UserDTO, id: number): User | null {
    const index = this.users.findIndex(item => item.id === Number(id));
    if (index !== -1) {
      this.users[index] = {
        ...this.users[index],
        ...userDTO
      };
      return this.users[index]; // Return the updated user
    }
    return null; // Return null if user not found
  }

  // Deletes a user by ID
  deleteUser(id: number): boolean {
    const index = this.users.findIndex(item => item.id === Number(id));
    if (index !== -1) {
      this.users.splice(index, 1); // Remove the user from the list
      return true; // Return true to indicate successful deletion
    }
    return false; // Return false if user not found
  }
}
