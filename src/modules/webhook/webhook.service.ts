import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { LivekitService } from '@/src/modules/libs/livekit/livekit.service';
import { TelegramService } from '@/src/modules/libs/telegram/telegram.service';
import { NotificationService } from '@/src/modules/notification/notification.service';

@Injectable()
export class WebhookService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly livekitService: LivekitService,
    private readonly notificationService: NotificationService,
    private readonly telegramService: TelegramService
  ) {}

  public async receiveWebhookLivekit(body: string, authorization: string) {
    const event = this.livekitService.receiver.receive(
      body,
      authorization,
      true
    );

    if (event.event === 'ingress_started') {
      const stream = await this.prismaService.stream.update({
        where: {
          ingressId: event.ingressInfo?.ingressId,
        },
        data: {
          isLive: true,
        },
        include: {
          user: true,
        },
      });

      if (!stream.user) {
        throw new BadRequestException('Stream start failed');
      }

      const followerList = await this.prismaService.follow.findMany({
        where: {
          followingId: stream.user?.id,
          follower: {
            isDeactivated: true,
          },
        },
        include: {
          follower: {
            include: {
              notificationSettings: true,
            },
          },
        },
      });

      for (const follow of followerList) {
        const follower = follow.follower;

        if (follower.notificationSettings?.siteNotifications) {
          await this.notificationService.createStreamStart(
            follower.id,
            stream.user
          );
        }

        if (
          follower.notificationSettings?.telegramNotifications &&
          follower.telegramId
        ) {
          await this.telegramService.sendStreamStart(
            follower.telegramId,
            stream.user
          );
        }
      }
    }

    if (event.event === 'ingress_ended') {
      const stream = await this.prismaService.stream.update({
        where: {
          ingressId: event.ingressInfo?.ingressId,
        },
        data: {
          isLive: false,
        },
      });

      await this.prismaService.chatMessage.deleteMany({
        where: {
          streamId: stream.id,
        },
      });
    }
  }
}
