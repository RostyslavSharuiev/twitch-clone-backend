import { Field, ID, ObjectType } from '@nestjs/graphql';
import type { NotificationSettings } from '@prisma/generated/client';

import { UserModel } from '@/src/modules/auth/account/models/user.model';

@ObjectType()
export class NotificationSettingsModel implements NotificationSettings {
  @Field(() => ID)
  public id!: string;

  @Field(() => Date)
  public createdAt!: Date;

  @Field(() => Date)
  public updatedAt!: Date;

  @Field(() => Boolean)
  public siteNotifications!: boolean;

  @Field(() => Boolean)
  public telegramNotifications!: boolean;

  @Field(() => UserModel)
  public user!: UserModel;

  @Field(() => String)
  public userId!: string;
}

@ObjectType()
export class ChangeNotificationSettingsResponse {
  @Field(() => NotificationSettingsModel)
  public notificationSetting!: NotificationSettingsModel;

  @Field(() => String, { nullable: true })
  public telegramAuthToken!: string | null;
}
