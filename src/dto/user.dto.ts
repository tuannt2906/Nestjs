import { IsNotEmpty, IsNumber, MinLength } from "class-validator";

export class UserDTO {
  username?: string;

  @MinLength(8, { message: 'Password must be than 8 characters!'})
  password?: string;

  @IsNotEmpty()
  email?: string;

  gender?: string;
  phonenumber?: string;

  @IsNumber()
  age?: number;
};