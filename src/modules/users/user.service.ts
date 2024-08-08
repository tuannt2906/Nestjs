import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUsers(): string {
    return 'Get list Users';
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
