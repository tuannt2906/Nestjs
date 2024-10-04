import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

async function emailExists(email: string): Promise<boolean> {
  return false;
}

async function usernameExists(username: string): Promise<boolean> {
  return false;
}

const existenceInfo = {
  email: emailExists,
  username: usernameExists,
};

@ValidatorConstraint({ async: true })
export class IsUniqueFieldConstraint implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    const [field] = args.constraints;
    const checkFunction = existenceInfo[field];
    if (checkFunction) {
      return !(await checkFunction(value));
    }
    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    const [field] = args.constraints;
    return `${field} already exists!`;
  }
}

@ValidatorConstraint({ async: true })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must contain at least one uppercase letter, one special character, one number, and be at least 8 characters long.';
  }
}

@ValidatorConstraint({ async: true })
export class IsValidEmailConstraint implements ValidatorConstraintInterface {
  validate(email: string, args: ValidationArguments) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid email format!';
  }
}
