import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import type { Request } from 'express';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { RedisService } from '@/src/core/redis/redis.service';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata/session-metadata.util';

import { LoginInput } from './inputs/login.input';
import { SessionModel } from './models/session.model';

@Injectable()
export class SessionService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService
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
    const { login, password } = input;

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

    const metadata = getSessionMetadata(req, userAgent);

    return new Promise((resolve, reject) => {
      req.session.createdAt = new Date();
      req.session.userId = user.id;
      req.session.metadata = metadata;

      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException('Session save failed')
          );
        }

        resolve(user);
      });
    });
  }

  public async logout(req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(new InternalServerErrorException('Session end failed'));
        }

        req.res?.clearCookie(
          this.configService.getOrThrow<string>('SESSION_NAME')
        );

        resolve(true);
      });
    });
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
