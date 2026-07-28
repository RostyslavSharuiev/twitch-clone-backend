import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { MIN_PASSWORD_LENGTH } from '@/src/shared/constants/constants';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
  public username!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  public password!: string;
}
