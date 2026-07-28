import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import type { Request } from 'express';
import { TOTP } from 'otpauth';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { RedisService } from '@/src/core/redis/redis.service';
import { VerificationService } from '@/src/modules/auth/verification/verification.service';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata/session-metadata.util';
import {
  destroySession,
  saveSession,
} from '@/src/shared/utils/session/session.util';

import { LoginInput } from './inputs/login.input';
import { SessionModel } from './models/session.model';

@Injectable()
export class SessionService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly verificationService: VerificationService
  ) {}

  public async findByUser(req: Request) {
    const userId = req.session.userId;

    if (!userId) throw new NotFoundException('User not found in session');

    const keys = await this.redisService.client.keys('*');

    const userSessions: SessionModel[] = [];

    for (const key of keys) {
      const redisKey = key.toString();
      const sessionData = await this.redisService.client.get(redisKey);

      if (sessionData) {
        const session = JSON.parse(sessionData.toString()) as SessionModel;

        if (session.userId === userId) {
          userSessions.push({
            ...session,
            id: redisKey.split(':')[1],
          });
        }
      }
    }

    userSessions.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();

      return bTime - aTime;
    });

    return userSessions.filter((session) => session.id !== req.session.id);
  }

  public async findCurrent(req: Request) {
    const sessionId = req.session.id;

    if (!sessionId) {
      throw new NotFoundException('Session id not found');
    }

    const redisKey = `${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`;
    const sessionData = await this.redisService.client.get(redisKey);

    if (!sessionData) {
      throw new NotFoundException('Session not found');
    }

    const session = JSON.parse(sessionData.toString()) as Partial<SessionModel>;

    return {
      ...session,
      id: sessionId,
    };
  }

  public async login(req: Request, input: LoginInput, userAgent: string) {
    const { login, password, pin } = input;

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: { equals: login } }, { email: { equals: login } }],
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Wrong username or password');
    }

    if (!user.isVerified) {
      await this.verificationService.sendVerificationToken(user);

      throw new BadRequestException(
        'Account not verified. Please, check your email for confirm'
      );
    }

    if (user.isTotpEnabled) {
      if (!pin) {
        return { message: 'Pin code required for authorization' };
      }

      const totp = new TOTP({
        issuer: 'TwitchClone',
        label: `${user.email}`,
        algorithm: 'SHA1',
        digits: 6,
        secret: String(user.totpSecret),
      });

      const delta = totp.validate({ token: pin });

      if (delta === null) throw new BadRequestException('Wrong code');
    }

    const metadata = getSessionMetadata(req, userAgent);

    return saveSession(req, user, metadata);
  }

  public async logout(req: Request) {
    return destroySession(req, this.configService);
  }

  public clearSession(req: Request) {
    req.res?.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));

    return true;
  }

  public async remove(req: Request, id: string) {
    if (req.session.id === id) {
      throw new ConflictException('Cannot delete current session');
    }

    const redisKey = `${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`;

    await this.redisService.client.del(redisKey);

    return true;
  }
}
