import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'argon2';
import { Request } from 'express';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { TokenType } from '@/src/generated/prisma/enums';
import { MailService } from '@/src/modules/libs/mail/mail.service';
import { TelegramService } from '@/src/modules/libs/telegram/telegram.service';
import { generateToken } from '@/src/shared/utils/generate-token/generate-token.util';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata/session-metadata.util';

import { NewPasswordInput } from './input/new-password.input';
import { ResetPasswordInput } from './input/reset-password.input';

@Injectable()
export class PasswordRecoveryService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly telegramService: TelegramService
  ) {}

  public async resetPassword(
    req: Request,
    input: ResetPasswordInput,
    userAgent: string
  ) {
    const { email } = input;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        notificationSettings: true,
      },
    });

    if (!user) {
      throw new NotAcceptableException('User not found');
    }

    const resetToken = await generateToken(
      this.prismaService,
      user,
      TokenType.PASSWORD_RESET
    );

    const metadata = getSessionMetadata(req, userAgent);

    await this.mailService.sendPasswordResetToken(
      user.email,
      resetToken.token,
      metadata
    );

    if (
      resetToken.user?.notificationSettings?.telegramNotifications &&
      resetToken.user.telegramId
    ) {
      await this.telegramService.sendPasswordResetToken(
        resetToken.user.telegramId,
        resetToken.token,
        metadata
      );
    }

    return true;
  }

  public async newPassword(input: NewPasswordInput) {
    const { password, token } = input;

    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
      },
    });

    if (!existingToken) {
      throw new NotFoundException('Token not found');
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException('Token expires');
    }

    const userId = existingToken.userId;

    if (!userId) {
      throw new NotFoundException('User for token not found');
    }

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: await hash(password),
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.PASSWORD_RESET,
      },
    });

    return true;
  }
}
