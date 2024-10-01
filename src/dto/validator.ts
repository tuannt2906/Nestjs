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

async function phonenumberExists(phoneNumber: string): Promise<boolean> {
  return false;
}

const existenceInfo = {
  email: emailExists,
  username: usernameExists,
  phoneNumber: phonenumberExists,
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
