import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseData } from 'modules/global/globalClass';
import { HttpStatus, HttpMessage } from 'modules/global/globalEnum';
import { User } from 'models/user.model';
import { UserDTO } from 'dto/user.dto';

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

  @Get('/:id')
  detailUser(@Param('id') id: number): ResponseData<User> {
    try {
      return new ResponseData<User>(this.userService.detailUser(id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<User>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post()
  async createUser(@Body(new ValidationPipe()) userDTO: UserDTO): Promise<ResponseData<User>> {
    try {
      const user = await this.userService.createUser(userDTO);
      return new ResponseData<User>(user, HttpStatus.CREATED, HttpMessage.SUCCESS); // Update to use CREATED status
    } catch (error) {
      return new ResponseData<User>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put('/:id')
  async updateUser(@Body() userDTO: UserDTO, @Param('id') id: number): Promise<ResponseData<User | null>> {
    try {
      const updatedUser = await this.userService.updateUser(userDTO, id);
      return new ResponseData<User | null>(updatedUser, HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<User | null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number): ResponseData<boolean> {
    try {
      return new ResponseData<boolean>(this.userService.deleteUser(id), HttpStatus.SUCCESS, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData<boolean>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
