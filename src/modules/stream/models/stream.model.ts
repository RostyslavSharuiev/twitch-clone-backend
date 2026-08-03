import { Field, ID, ObjectType } from '@nestjs/graphql';

import type { Stream } from '@/src/generated/prisma/client';
import { UserModel } from '@/src/modules/auth/account/models/user.model';
import { CategoryModel } from '@/src/modules/category/models/category.model';
import { ChatMessageModel } from '@/src/modules/chat/models/chat-message.model';

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

  @Field(() => String, { nullable: true })
  public categoryId!: string | null;

  @Field(() => CategoryModel)
  public category!: CategoryModel;

  @Field(() => Boolean)
  public isChatEnabled!: boolean;

  @Field(() => Boolean)
  public isChatFollowersOnly!: boolean;

  @Field(() => Boolean)
  public isChatPremiumFollowersOnly!: boolean;

  @Field(() => [ChatMessageModel])
  public chatMessages!: ChatMessageModel[];
}
