import { 
  IsNotEmpty, 
  IsString, 
  IsEmail, 
  MinLength, 
  MaxLength,
  Matches, 
  Validate, 
} from 'class-validator';
import { IsUniqueFieldConstraint } from './validator';

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Username is required and should not be empty.' })
  @MaxLength(255, { message: 'Username should not be longer than 255 characters.' })
  @Validate(IsUniqueFieldConstraint, ['username'])
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/, 
    { message: 'Password must contain at least one uppercase letter, one special character, one number, and be at least 8 characters long.' })
  password: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format!' })
  @Validate(IsUniqueFieldConstraint, ['email'])
  email: string;
}
