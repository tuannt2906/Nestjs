import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator'

// Check email and username existed function
async function emailExists(email: string): Promise<boolean> {
    // Database query to check when have database
    return false;
}

async function usernameExists(username: string): Promise<boolean> {
    // Database query to check when have database
    return false;
}

@ValidatorConstraint({ async: true })
export class IsEmailExistsConstraint implements ValidatorConstraintInterface {
  async validate(email: string, args: ValidationArguments): Promise<boolean> {
    return !(await emailExists(email));
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Email already exists!';
  }
}

@ValidatorConstraint({ async: true })
export class IsUsernameExistsConstraint implements ValidatorConstraintInterface {
  async validate(username: string, args: ValidationArguments): Promise<boolean> {
    return !(await usernameExists(username));
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Username already exists!';
  }
}

@ValidatorConstraint({ async: true })
export class IsUniqueEmailOrUsernameConstraint implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    const [field] = args.constraints;
    if (field === 'email') {
      return !(await emailExists(value));
    }
    if (field === 'username') {
      return !(await usernameExists(value));
    }
    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} already exists!`;
  }
}