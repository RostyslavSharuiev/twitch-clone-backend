import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';

import type { User } from '@/src/generated/prisma/client';
import type { GqlContext } from '@/src/shared/types/gql-context.types';

export const Authorized = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    let user: User;

    if (ctx.getType() === 'http') {
      const request = ctx.switchToHttp().getRequest<Request & { user: User }>();
      user = request.user;
    } else {
      const context = GqlExecutionContext.create(ctx);
      const { req } = context.getContext<GqlContext>();
      user = (req as Request & { user: User }).user;
    }

    return data ? user[data] : user;
  }
);
