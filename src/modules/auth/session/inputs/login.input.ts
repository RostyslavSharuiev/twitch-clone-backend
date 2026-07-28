import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { MIN_PASSWORD_LENGTH } from '@/src/shared/constants/constants';

@InputType()
export class LoginInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  public login!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  public password!: string;
}
