import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
// Nhan cac req tu clien -> server va response server -> clienr (data from service)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/check-health')
  checkHealth(): string {
    return 'Ok';
  }

  @Get()
  getUsers(): string {
    return this.userService.getUsers();
  }

  @Put('/:id')
  updateUser(): string {
    return this.userService.updateUser();
  }

  @Delete('/:id')
  deleteUser(): string {
    return this.userService.deleteUser();
  }

  @Get('/:id')
  detailUser(): string {
    return this.userService.detailUser();
  }

  @Post()
  createUser(): string {
    return this.userService.createUser();
  }
}
