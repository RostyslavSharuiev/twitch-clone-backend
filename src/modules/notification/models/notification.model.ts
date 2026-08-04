import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import { Notification, NotificationType } from '@/src/generated/prisma/client';
import { UserModel } from '@/src/modules/auth/account/models/user.model';

registerEnumType(NotificationType, {
  name: 'NotificationType',
});

@ObjectType()
export class NotificationModel implements Notification {
  @Field(() => ID)
  public id!: string;

  @Field(() => Date)
  public createdAt!: Date;

  @Field(() => Date)
  public updatedAt!: Date;

  @Field(() => String)
  public message!: string;

  @Field(() => NotificationType)
  public type!: NotificationType;

  @Field(() => Boolean)
  public isRead!: boolean;

  @Field(() => UserModel)
  public user!: UserModel;

  @Field(() => String, { nullable: true })
  public userId!: string | null;
}
