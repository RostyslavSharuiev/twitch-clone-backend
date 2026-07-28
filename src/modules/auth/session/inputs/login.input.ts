import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

import {
  MIN_PASSWORD_LENGTH,
  TOTP_PIN_LENGTH,
} from '@/src/shared/constants/constants';

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  public login!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  public password!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @Length(TOTP_PIN_LENGTH, TOTP_PIN_LENGTH)
  public pin?: string;
}
