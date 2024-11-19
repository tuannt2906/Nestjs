import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Body,
  ValidationPipe,
  HttpException,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseData } from 'modules/global/globalClass';
import {
  HttpMessage,
  HttpStatus as GlobalHttpStatus,
} from 'modules/global/globalEnum';
import { User } from '@prisma/client';
import { UserDTO } from 'modules/users/dto/user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/guard/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: ResponseData })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getUsers(): Promise<ResponseData<User[]>> {
    try {
      const users = await this.userService.getUsers();
      return new ResponseData<User[]>(
        users,
        GlobalHttpStatus.OK,
        HttpMessage.OK,
      );
    } catch (error) {
      throw new HttpException(
        new ResponseData<User[]>(
          null,
          GlobalHttpStatus.INTERNAL_SERVER_ERROR,
          HttpMessage.INTERNAL_SERVER_ERROR,
        ),
        GlobalHttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Fetch user by ID' })
  @ApiParam({ name: 'id', required: true, description: 'User ID', type: Number })
  @ApiResponse({ status: 200, description: 'User detail', type: ResponseData })
  @ApiResponse({ status: 404, description: 'User not found' })
  async detailUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseData<User>> {
    try {
      const user = await this.userService.detailUser(id);
      return new ResponseData<User>(user, GlobalHttpStatus.OK, HttpMessage.OK);
    } catch (error) {
      throw new HttpException(
        new ResponseData<User>(
          null,
          GlobalHttpStatus.INTERNAL_SERVER_ERROR,
          HttpMessage.INTERNAL_SERVER_ERROR,
        ),
        GlobalHttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: ResponseData })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createUser(
    @Body(new ValidationPipe()) userDTO: UserDTO,
  ): Promise<ResponseData<User>> {
    try {
      const user = await this.userService.createUser(userDTO);
      return new ResponseData<User>(
        user,
        GlobalHttpStatus.CREATED,
        HttpMessage.CREATED,
      );
    } catch (error) {
      if (error.response?.statusCode === GlobalHttpStatus.BAD_REQUEST) {
        throw new HttpException(
          new ResponseData<User>(
            null,
            GlobalHttpStatus.BAD_REQUEST,
            HttpMessage.BAD_REQUEST,
          ),
          GlobalHttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        new ResponseData<User>(
          null,
          GlobalHttpStatus.INTERNAL_SERVER_ERROR,
          HttpMessage.INTERNAL_SERVER_ERROR,
        ),
        GlobalHttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', required: true, description: 'User ID', type: Number })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: ResponseData })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateUser(
    @Body(new ValidationPipe()) userDTO: UserDTO,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseData<User>> {
    try {
      const updatedUser = await this.userService.updateUser(userDTO, id);
      return new ResponseData<User>(
        updatedUser,
        GlobalHttpStatus.OK,
        HttpMessage.OK,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          new ResponseData<User>(
            null,
            GlobalHttpStatus.NOT_FOUND,
            HttpMessage.NOT_FOUND,
          ),
          GlobalHttpStatus.NOT_FOUND,
        );
      } else if (error instanceof BadRequestException) {
        throw new HttpException(
          new ResponseData<User>(
            null,
            GlobalHttpStatus.BAD_REQUEST,
            HttpMessage.BAD_REQUEST,
          ),
          GlobalHttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        new ResponseData<User>(
          null,
          GlobalHttpStatus.INTERNAL_SERVER_ERROR,
          HttpMessage.INTERNAL_SERVER_ERROR,
        ),
        GlobalHttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', required: true, description: 'User ID', type: Number })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseData<void>> {
    try {
      await this.userService.deleteUser(id);
      return new ResponseData<void>(
        null,
        GlobalHttpStatus.NO_CONTENT,
        HttpMessage.NO_CONTENT,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          new ResponseData<void>(
            null,
            GlobalHttpStatus.NOT_FOUND,
            HttpMessage.NOT_FOUND,
          ),
          GlobalHttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        new ResponseData<void>(
          null,
          GlobalHttpStatus.INTERNAL_SERVER_ERROR,
          HttpMessage.INTERNAL_SERVER_ERROR,
        ),
        GlobalHttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
