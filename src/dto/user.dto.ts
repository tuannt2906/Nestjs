import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Validate,
  IsOptional,
} from 'class-validator';
import {
  IsUniqueFieldConstraint,
  IsValidEmailConstraint,
  IsValidPasswordConstraint,
} from './validator';

export class UserDTO {
  @IsOptional()
  id?: number;
  
  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Username is required and should not be empty.' })
  @MaxLength(255, {
    message: 'Username should not be longer than 255 characters.',
  })
  @Validate(IsUniqueFieldConstraint, ['username'])
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Validate(IsValidPasswordConstraint)
  password: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format!' })
  @Validate(IsUniqueFieldConstraint, ['email'])
  @Validate(IsValidEmailConstraint)
  email: string;
}
