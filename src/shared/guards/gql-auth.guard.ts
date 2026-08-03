import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import type { GqlContext } from '@/src/shared/types/gql-context.types';

type AuthenticatedRequest = Request & {
  session: { userId?: string };
  user: unknown;
};

@Injectable()
export class GqlAuthGuard implements CanActivate {
  public constructor(private readonly prismaService: PrismaService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<GqlContext>();
    const request = req as AuthenticatedRequest;

    if (typeof request.session.userId === 'undefined') {
      throw new UnauthorizedException('User not authorized');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: request.session.userId },
    });

    request.user = user;

    return true;
  }
}
