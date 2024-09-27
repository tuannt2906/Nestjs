import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// Check functions for various fields
async function emailExists(email: string): Promise<boolean> {
  // Database query to check email existence
  return false;
}

async function usernameExists(username: string): Promise<boolean> {
  // Database query to check username existence
  return false;
}

async function phonenumberExists(phoneNumber: string): Promise<boolean> {
  // Database query to check phoneNumber existence
  return false;
}

// Map fields to their corresponding existence checking functions
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
