import { Injectable } from '@nestjs/common';
import { User } from 'models/user.model';

@Injectable()
export class UserService {

  private users: User[] = [
    {id: 1, fullname: "Alex Patinson", age: 18},
    {id: 2, fullname: "Robert Adam", age: 19},
  ]

  getUsers(): User[] {
    return this.users;
  }

  checkHealth(): string {
    return 'Ok';
  }

  createUser(): string {
    return 'Add Users';
  }

  detailUser(): string {
    return 'User Detail';
  }

  updateUser(): string {
    return 'Update user';
  }

  deleteUser(): string {
    return 'Delete User';
  }
}
