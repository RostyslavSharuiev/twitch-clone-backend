import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { MIN_PASSWORD_LENGTH } from '@/src/shared/constants/constants';

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  public oldPassword!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  public newPassword!: string;
}
