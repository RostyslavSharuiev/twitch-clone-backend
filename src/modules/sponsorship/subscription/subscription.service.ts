import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import type { User } from '@/src/generated/prisma/client';

@Injectable()
export class SubscriptionService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findMySponsors(user: User) {
    return await this.prismaService.sponsorshipSubscription.findMany({
      where: {
        channelId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        plan: true,
        user: true,
        channel: true,
      },
    });
  }
}
