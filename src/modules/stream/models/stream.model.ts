import { Field, ID, ObjectType } from '@nestjs/graphql';

import type { Stream } from '@/src/generated/prisma/client';
import { UserModel } from '@/src/modules/auth/account/models/user.model';

@ObjectType()
export class StreamModel implements Stream {
  @Field(() => ID)
  public id!: string;

  @Field(() => Date)
  public createdAt!: Date;

  @Field(() => Date)
  public updatedAt!: Date;

  @Field(() => String)
  public title!: string;

  @Field(() => String, { nullable: true })
  public thumbnailUrl!: string | null;

  @Field(() => Boolean)
  public isLive!: boolean;

  @Field(() => String)
  public ingressId!: string | null;

  @Field(() => String, { nullable: true })
  public serverUrl!: string | null;

  @Field(() => String, { nullable: true })
  public streamKey!: string | null;

  @Field(() => String)
  public userId!: string;

  @Field(() => UserModel)
  public user!: UserModel;
}
