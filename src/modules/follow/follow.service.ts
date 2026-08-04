import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import type { User } from '@/src/generated/prisma/client';
import { TelegramService } from '@/src/modules/libs/telegram/telegram.service';
import { NotificationService } from '@/src/modules/notification/notification.service';

@Injectable()
export class FollowService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly telegramService: TelegramService
  ) {}

  public async findMyFollowers(user: User) {
    return await this.prismaService.follow.findMany({
      where: {
        followingId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        follower: true,
      },
    });
  }

  public async findMyFollowings(user: User) {
    return await this.prismaService.follow.findMany({
      where: {
        followerId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        following: true,
      },
    });
  }

  public async follow(user: User, channelId: string) {
    const channel = await this.prismaService.user.findUnique({
      where: {
        id: channelId,
      },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    if (channel.id === user.id) {
      throw new ConflictException('You cannot follow yourself');
    }

    const existingFollow = await this.prismaService.follow.findFirst({
      where: {
        followerId: user.id,
        followingId: channel.id,
      },
    });

    if (existingFollow) {
      throw new ConflictException('You are already following this channel');
    }

    const follow = await this.prismaService.follow.create({
      data: {
        followerId: user.id,
        followingId: channel.id,
      },
      include: {
        follower: true,
        following: {
          include: {
            notificationSettings: true,
          },
        },
      },
    });

    if (follow.following.notificationSettings?.siteNotifications) {
      await this.notificationService.createNewFollowing(
        follow.following.id,
        follow.follower
      );
    }

    if (
      follow.following.notificationSettings?.telegramNotifications &&
      follow.following.telegramId
    ) {
      await this.telegramService.sendNewFollowing(
        follow.following.telegramId,
        follow.follower
      );
    }

    return true;
  }

  public async unfollow(user: User, channelId: string) {
    const channel = await this.prismaService.user.findUnique({
      where: {
        id: channelId,
      },
    });

    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    if (channel.id === user.id) {
      throw new ConflictException('You cannot unfollow yourself');
    }

    const existingFollow = await this.prismaService.follow.findFirst({
      where: {
        followerId: user.id,
        followingId: channel.id,
      },
    });

    if (!existingFollow) {
      throw new ConflictException("You don't follow this channel");
    }

    await this.prismaService.follow.delete({
      where: {
        id: existingFollow.id,
        followerId: user.id,
        followingId: channel.id,
      },
    });

    return true;
  }
}
