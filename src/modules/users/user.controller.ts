import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseData } from 'modules/global/globalClass';
import { HttpStatus, HttpMessage } from 'modules/global/globalEnum';
import { User } from 'models/user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): ResponseData<User[]> {
    try {
      return new ResponseData<User[]>(this.userService.getUsers(), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<User[]>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('/check-health')
  checkHealth(): string {
    return 'Ok';
  }

  @Post()
  createUser(): ResponseData<string> {
    try {
      return new ResponseData<string>(this.userService.createUser(), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('/:id')
  detailUser(): ResponseData<string> {
    try {
      return new ResponseData<string>(this.userService.detailUser(), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put('/:id')
  updateUser(): ResponseData<string> {
    try {
      return new ResponseData<string>(this.userService.updateUser(), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete('/:id')
  deleteUser(): ResponseData<string> {
    try {
      return new ResponseData<string>(this.userService.deleteUser(), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<string>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
