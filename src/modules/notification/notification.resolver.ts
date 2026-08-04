import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import type { User } from '@/src/generated/prisma/client';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorizate.decorator';

import { ChangeNotificationSettingsInput } from './inputs/change-notification-settings.input';
import { ChangeNotificationSettingsResponse } from './models/notification-settings.model';
import { NotificationModel } from './models/notification.model';
import { NotificationService } from './notification.service';

@Resolver('Notification')
export class NotificationResolver {
  public constructor(
    private readonly notificationService: NotificationService
  ) {}

  @Authorization()
  @Query(() => Number, { name: 'findNotificationsUnreadCount' })
  public async findUnreadCount(@Authorized() user: User) {
    return this.notificationService.findUnreadCount(user);
  }

  @Authorization()
  @Query(() => [NotificationModel], { name: 'findNotificationsByUser' })
  public async findByUser(@Authorized() user: User) {
    return this.notificationService.findByUser(user);
  }

  @Authorization()
  @Mutation(() => ChangeNotificationSettingsResponse, {
    name: 'changeNotificationsSettings',
  })
  public async changeSettings(
    @Authorized() user: User,
    @Args('data') input: ChangeNotificationSettingsInput
  ) {
    return this.notificationService.changeSettings(user, input);
  }
}
