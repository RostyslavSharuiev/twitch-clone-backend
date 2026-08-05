import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { MailService } from '@/src/modules/libs/mail/mail.service';
import { StorageService } from '@/src/modules/libs/storage/storage.service';
import { TelegramService } from '@/src/modules/libs/telegram/telegram.service';
import { NotificationService } from '@/src/modules/notification/notification.service';

@Injectable()
export class CronService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly storageService: StorageService,
    private readonly telegramService: TelegramService,
    private readonly notificationService: NotificationService
  ) {}

  @Cron(CronExpression.EVERY_WEEK)
  public async deleteDeactivatedAccounts() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDay() - 7);

    const deactivatedAccounts = await this.prismaService.user.findMany({
      where: {
        isDeactivated: true,
        deactivateAt: {
          lte: sevenDaysAgo,
        },
      },
      include: {
        stream: true,
        notificationSettings: true,
      },
    });

    for (const user of deactivatedAccounts) {
      await this.mailService.sendAccountDeletion(user.email);

      if (user.notificationSettings?.telegramNotifications && user.telegramId) {
        await this.telegramService.sendAccountDeletion(user.telegramId);
      }

      if (user.avatar) {
        await this.storageService.remove(user.avatar);
      }

      if (user.stream && user.stream.thumbnailUrl) {
        await this.storageService.remove(user.stream.thumbnailUrl);
      }
    }

    await this.prismaService.user.deleteMany({
      where: {
        isDeactivated: true,
        deactivateAt: {
          lte: sevenDaysAgo,
        },
      },
    });
  }

  @Cron('0 0 */4 * *') // every 4 days at midnight
  public async notifyUserEnableTwoFactor() {
    const users = await this.prismaService.user.findMany({
      where: {
        isTotpEnabled: false,
      },
      include: {
        notificationSettings: true,
      },
    });

    for (const user of users) {
      await this.mailService.sendEnableTwoFactor(user.email);

      if (user.notificationSettings?.siteNotifications) {
        await this.notificationService.createEnableTwoFactor(user.id);
      }

      if (user.notificationSettings?.telegramNotifications && user.telegramId) {
        await this.telegramService.sendEnableTwoFactor(user.telegramId);
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async verifyChannel() {
    const users = await this.prismaService.user.findMany({
      include: {
        notificationSettings: true,
      },
    });

    for (const user of users) {
      const followersCount = await this.prismaService.follow.count({
        where: {
          followingId: user.id,
        },
      });

      if (followersCount > 10 && !user.isVerified) {
        await this.prismaService.user.update({
          where: {
            id: user.id,
          },
          data: {
            isVerified: true,
          },
        });

        await this.mailService.sendVerifiedChannel(user.email);

        if (user.notificationSettings?.siteNotifications) {
          await this.notificationService.createVerifyChannel(user.id);
        }

        if (
          user.notificationSettings?.telegramNotifications &&
          user.telegramId
        ) {
          await this.telegramService.sendVerifyChannel(user.telegramId);
        }
      }
    }
  }

  @Cron(CronExpression.EVERY_WEEK)
  public async deleteOldNotifications() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await this.prismaService.notification.deleteMany({
      where: {
        createdAt: {
          lte: sevenDaysAgo,
        },
      },
    });
  }
}
