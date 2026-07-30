import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { MAX_BIO_LENGTH } from '@/src/shared/constants/constants';

@InputType()
export class ChangeProfileInfoInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
  public username!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  public displayName!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(MAX_BIO_LENGTH)
  public bio?: string | null;
}
