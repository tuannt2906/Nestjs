import { Controller, Delete, Get, Post, Put, Param, Body, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseData } from 'modules/global/globalClass';
import { HttpMessage, HttpStatus as GlobalHttpStatus } from 'modules/global/globalEnum';
import { User } from 'models/user.model';
import { UserDTO } from 'dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<ResponseData<User[]>> {
    try {
      const users = await this.userService.getUsers();
      return new ResponseData<User[]>(users, GlobalHttpStatus.OK, HttpMessage.OK);
    } catch (error) {
      throw new HttpException(
        new ResponseData<User[]>(null, GlobalHttpStatus.INTERNAL_SERVER_ERROR, HttpMessage.INTERNAL_SERVER_ERROR),
        GlobalHttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('/:id')
  async detailUser(@Param('id') id: number): Promise<ResponseData<User>> {
    try {
      const user = await this.userService.detailUser(id);
      if (!user) {
        throw new HttpException(
          new ResponseData<User>(null, GlobalHttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND),
          GlobalHttpStatus.NOT_FOUND
        );
      }
      return new ResponseData<User>(user, GlobalHttpStatus.OK, HttpMessage.OK);
    } catch (error) {
      throw new HttpException(
        new ResponseData<User>(null, GlobalHttpStatus.INTERNAL_SERVER_ERROR, HttpMessage.INTERNAL_SERVER_ERROR),
        GlobalHttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  async createUser(@Body(new ValidationPipe()) userDTO: UserDTO): Promise<ResponseData<User>> {
    try {
      const user = await this.userService.createUser(userDTO);
      return new ResponseData<User>(user, GlobalHttpStatus.CREATED, HttpMessage.CREATED);
    } catch (error) {
      if (error.response?.statusCode === GlobalHttpStatus.BAD_REQUEST) {
        throw new HttpException(
          new ResponseData<User>(null, GlobalHttpStatus.BAD_REQUEST, HttpMessage.BAD_REQUEST),
          GlobalHttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        new ResponseData<User>(null, GlobalHttpStatus.INTERNAL_SERVER_ERROR, HttpMessage.INTERNAL_SERVER_ERROR),
        GlobalHttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('/:id')
  async updateUser(@Body(new ValidationPipe()) userDTO: UserDTO, @Param('id') id: number): Promise<ResponseData<User | null>> {
    try {
      const updatedUser = await this.userService.updateUser(userDTO, id);
      if (!updatedUser) {
        throw new HttpException(
          new ResponseData<User | null>(null, GlobalHttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND),
          GlobalHttpStatus.NOT_FOUND
        );
      }
      return new ResponseData<User | null>(updatedUser, GlobalHttpStatus.OK, HttpMessage.OK);
    } catch (error) {
      if (error.response?.statusCode === GlobalHttpStatus.BAD_REQUEST) {
        throw new HttpException(
          new ResponseData<User | null>(null, GlobalHttpStatus.BAD_REQUEST, HttpMessage.BAD_REQUEST),
          GlobalHttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        new ResponseData<User | null>(null, GlobalHttpStatus.INTERNAL_SERVER_ERROR, HttpMessage.INTERNAL_SERVER_ERROR),
        GlobalHttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number): Promise<ResponseData<boolean>> {
    try {
      const result = await this.userService.deleteUser(id);
      if (!result) {
        throw new HttpException(
          new ResponseData<boolean>(null, GlobalHttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND),
          GlobalHttpStatus.NOT_FOUND
        );
      }
      return new ResponseData<boolean>(result, GlobalHttpStatus.OK, HttpMessage.OK);
    } catch (error) {
      throw new HttpException(
        new ResponseData<boolean>(null, GlobalHttpStatus.INTERNAL_SERVER_ERROR, HttpMessage.INTERNAL_SERVER_ERROR),
        GlobalHttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
