import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

import { TOTP_PIN_LENGTH } from '@/src/shared/constants/constants';

@InputType()
export class EnableTotpInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  public secret!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @Length(TOTP_PIN_LENGTH, TOTP_PIN_LENGTH)
  public pin!: string;
}
