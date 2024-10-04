import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { IsValidPasswordConstraint } from 'modules/users/dto/validator';

export class CreateAuthDto {
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format!' })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Validate(IsValidPasswordConstraint)
  password: string;
}

export class CodeAuthDto {
  @IsNotEmpty({ message: 'Must have id!' })
  id: string;

  @IsNotEmpty({ message: 'Must have code!' })
  code: string;
}

export class ChangePasswordAuthDto {
  @IsNotEmpty({ message: 'Must have password!' })
  password: string;

  @IsNotEmpty({ message: 'Must have confirmPassword!' })
  confirmPassword: string;

  @IsNotEmpty({ message: 'Must have email!' })
  email: string;
}
