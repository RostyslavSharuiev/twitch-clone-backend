import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import type { Request } from 'express';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import type { User } from '@/src/generated/prisma/client';
import { TokenType } from '@/src/generated/prisma/enums';
import { MailService } from '@/src/modules/libs/mail/mail.service';
import { generateToken } from '@/src/shared/utils/generate-token/generate-token.util';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata/session-metadata.util';
import { destroySession } from '@/src/shared/utils/session/session.util';

import { DeactivateAccountInput } from './inputs/deactivate-account.input';

@Injectable()
export class DeactivateService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService
  ) {}

  public async sendDeactivateToken(
    req: Request,
    user: User,
    userAgent: string
  ) {
    const deactivateToken = await generateToken(
      this.prismaService,
      user,
      TokenType.DEACTIVATE_ACCOUNT,
      false
    );

    const metadata = getSessionMetadata(req, userAgent);

    await this.mailService.sendDeactivateToken(
      user.email,
      deactivateToken.token,
      metadata
    );

    return true;
  }

  public async deactivate(
    req: Request,
    input: DeactivateAccountInput,
    user: User,
    userAgent: string
  ) {
    const { email, password, pin } = input;

    if (user.email !== email)
      throw new BadRequestException('Email are invalid');

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) throw new BadRequestException('Password are invalid');

    if (!pin) {
      await this.sendDeactivateToken(req, user, userAgent);

      return { message: 'Pin code are required' };
    }

    await this.validateDeactivateToken(req, pin);

    return user;
  }

  private async validateDeactivateToken(req: Request, token: string) {
    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.DEACTIVATE_ACCOUNT,
      },
    });

    if (!existingToken) throw new NotFoundException('Token not found');

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) throw new BadRequestException('Token expires');

    const userId = existingToken.userId;

    if (!userId) throw new NotFoundException('User for token not found');

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        isDeactivated: true,
        deactivateAt: new Date(),
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.DEACTIVATE_ACCOUNT,
      },
    });

    return destroySession(req, this.configService);
  }
}
