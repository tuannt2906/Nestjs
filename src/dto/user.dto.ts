import { 
  IsNotEmpty, 
  IsString, 
  IsEmail, 
  MinLength, 
  MaxLength, 
  IsNumber, 
  IsIn, 
  Matches, 
  ValidateIf, 
  Validate, 
  ValidationArguments,
} from 'class-validator';
import { IsEmailExistsConstraint, IsUsernameExistsConstraint, IsUniqueEmailOrUsernameConstraint } from './validator';

export class UserDTO {
  @IsString()
  @MinLength(1, { message: 'Username is required and should not be empty.' })
  @MaxLength(255, { message: 'Username should not be longer than 255 characters.' })
  @ValidateIf(o => o.username !== undefined)
  @Validate(IsUsernameExistsConstraint, ['username'])
  username?: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  password?: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format!' })
  @Validate(IsEmailExistsConstraint, ['email'])
  email?: string;

  @IsIn([0, 1], { message: 'Gender must be 0 (male) or 1 (female).' })
  gender?: number;

  @Matches(/^\+\d+$/, { message: 'Phone number must be in the format "+xxxxx"' })
  phonenumber?: string;

  @IsNumber({}, { message: 'Age must be a number.' })
  age?: number;
}
