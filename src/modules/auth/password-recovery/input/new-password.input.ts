import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
  Validate,
} from 'class-validator';

import { MIN_PASSWORD_LENGTH } from '@/src/shared/constants/constants';
import { IsPasswordMatchingConstraint } from '@/src/shared/decorators/is-password-matching-constraint.decorator';

@InputType()
export class NewPasswordInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  public password!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  @Validate(IsPasswordMatchingConstraint)
  public passwordRepeat!: string;

  @Field(() => String)
  @IsUUID('4')
  @IsNotEmpty()
  public token!: string;
}
