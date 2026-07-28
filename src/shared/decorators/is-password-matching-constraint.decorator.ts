import {
  type ValidationArguments,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';

import { NewPasswordInput } from '@/src/modules/auth/password-recovery/input/new-password.input';

@ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {
  public validate(passwordRepeat: string, args: ValidationArguments) {
    const object = args.object as NewPasswordInput;

    return object.password === passwordRepeat;
  }

  public defaultMessage() {
    return 'Passwords are not equal';
  }
}
