import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Category } from '@/src/generated/prisma/client';
import { StreamModel } from '@/src/modules/stream/models/stream.model';

@ObjectType()
export class CategoryModel implements Category {
  @Field(() => ID)
  public id!: string;

  @Field(() => Date)
  public createdAt!: Date;

  @Field(() => Date)
  public updatedAt!: Date;

  @Field(() => String)
  public title!: string;

  @Field(() => String)
  public slug!: string;

  @Field(() => String, { nullable: true })
  public description!: string | null;

  @Field(() => String)
  public thumbnailUrl!: string;

  @Field(() => [StreamModel])
  public streams!: StreamModel[];
}
