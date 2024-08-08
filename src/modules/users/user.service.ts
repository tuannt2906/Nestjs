import { Injectable } from '@nestjs/common';
import { UserDTO } from 'dto/user.dto';
import { User } from 'models/user.model';

@Injectable()
export class UserService {

  private users: User[] = [
    {
      id: 1,
      username: "alex palestine",
      password: "hashed_password1",
      email: "alex.p@example.com",
      gender: "male",
      phonenumber: "+1234567890",
      age: 18
    },
    {
      id: 2,
      username: "robert adam",
      password: "hashed_password2",
      email: "robert.a@example.com",
      gender: "male",
      phonenumber: "+0987654321",
      age: 19
    },
  ]

  getUsers(): User[] {
    return this.users;
  }

  createUser(userDTO: UserDTO): User {
    const user: User = {
      id: Math.random(),
      ...userDTO
    };
    this.users.push(user);
    return userDTO;
  }

  detailUser(id: number): User {
    return this.users.find(item => item.id === Number(id)) as User;
  }

  updateUser(): string {
    return 'Update user';
  }

  deleteUser(): string {
    return 'Delete User';
  }
}
