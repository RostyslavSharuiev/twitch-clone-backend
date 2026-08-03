import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { FileUpload } from 'graphql-upload/processRequest.mjs';
import Upload from 'graphql-upload/Upload.mjs';
import { AccessToken } from 'livekit-server-sdk';
import sharp from 'sharp';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Prisma, User } from '@/src/generated/prisma/client';
import {
  DEFAULT_STREAM_SKIP_NUMBER,
  DEFAULT_STREAM_TAKE_NUMBER,
} from '@/src/shared/constants/constants';

import { StorageService } from './../libs/storage/storage.service';
import { ChangeStreamInfoInput } from './inputs/change-stream-info.input';
import { FiltersInput } from './inputs/filters.input';
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input';

@Injectable()
export class StreamService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly storageService: StorageService
  ) {}

  public async findAll(input: FiltersInput = {} as FiltersInput) {
    const { take, skip, searchTerm } = input;

    const whereClause = searchTerm
      ? this.findBySearchTermFilter(searchTerm)
      : undefined;

    const streams = await this.prismaService.stream.findMany({
      take: take ?? DEFAULT_STREAM_TAKE_NUMBER,
      skip: skip ?? DEFAULT_STREAM_SKIP_NUMBER,
      where: {
        user: {
          isDeactivated: false,
        },
        ...whereClause,
      },
      include: {
        user: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return streams;
  }

  public async findRandom() {
    const total = await this.prismaService.stream.count({
      where: {
        user: {
          isDeactivated: false,
        },
      },
    });

    const randomIndexList = new Set<number>();

    while (randomIndexList.size < 4) {
      const randomIndex = Math.floor(Math.random() * total);

      randomIndexList.add(randomIndex);
    }

    const streams = await this.prismaService.stream.findMany({
      skip: 0,
      take: total,
      where: {
        user: {
          isDeactivated: false,
        },
      },
      include: {
        user: true,
        category: true,
      },
    });

    return Array.from(randomIndexList).map((index) => streams[index]);
  }

  public async changeInfo(user: User, input: ChangeStreamInfoInput) {
    const { title, categoryId } = input;

    await this.prismaService.stream.update({
      where: {
        userId: user.id,
      },
      data: {
        title,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });

    return true;
  }

  public async changeThumbnail(user: User, file: Upload | Promise<Upload>) {
    const stream = await this.findByUserId(user);

    if (stream.thumbnailUrl) {
      await this.storageService.remove(stream?.thumbnailUrl);
    }

    const upload = await file;
    const fileUpload: FileUpload | undefined =
      upload.file ?? (await upload.promise);

    if (!fileUpload || typeof fileUpload.createReadStream !== 'function') {
      throw new BadRequestException('Invalid upload file');
    }

    const chunks: Buffer[] = [];
    const uploadStream = fileUpload.createReadStream() as AsyncIterable<Buffer>;

    for await (const chunk of uploadStream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    const filename = `/streams/${user.username}.webp`;

    if (fileUpload.filename?.endsWith('.gif')) {
      const processedBuffer = await sharp(buffer, { animated: true })
        .resize(1280, 720)
        .webp()
        .toBuffer();

      await this.storageService.upload(processedBuffer, filename, 'image/webp');
    } else {
      const processedBuffer = await sharp(buffer)
        .resize(1280, 720)
        .webp()
        .toBuffer();

      await this.storageService.upload(processedBuffer, filename, 'image/webp');
    }

    await this.prismaService.stream.update({
      where: {
        userId: user.id,
      },
      data: {
        thumbnailUrl: filename,
      },
    });

    return true;
  }

  public async removeThumbnail(user: User) {
    const stream = await this.findByUserId(user);

    if (!stream.thumbnailUrl) return;

    await this.storageService.remove(stream.thumbnailUrl);

    await this.prismaService.stream.update({
      where: {
        userId: user.id,
      },
      data: {
        thumbnailUrl: null,
      },
    });

    return true;
  }

  public async generateToken(input: GenerateStreamTokenInput) {
    const { userId, chanelId } = input;

    let self: { id: string; username: string };

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user) {
      self = {
        id: user.id,
        username: user.username,
      };
    } else {
      self = {
        id: userId,
        username: `Watcher ${Math.floor(Math.random() * 100_000)}`,
      };
    }

    const chanel = await this.prismaService.user.findUnique({
      where: {
        id: chanelId,
      },
    });

    if (!chanel) {
      throw new NotFoundException('Chanel not found');
    }

    const isHost = self.id === chanel.id;

    const token = new AccessToken(
      this.configService.getOrThrow<string>('LIVEKIT_API_KEY'),
      this.configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
      {
        identity: isHost ? `Host-${self.id}` : self.id,
        name: self.username,
      }
    );

    token.addGrant({
      room: chanel.id,
      roomJoin: true,
      canPublish: false,
    });

    return { token: token.toJwt() };
  }

  private findBySearchTermFilter(searchTerm: string): Prisma.StreamWhereInput {
    return {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          user: {
            username: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
    };
  }

  private async findByUserId(user: User) {
    const stream = await this.prismaService.stream.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!stream) throw new BadRequestException('Stream not found');

    return stream;
  }
}
