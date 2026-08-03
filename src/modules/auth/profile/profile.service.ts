import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
// mb change to version 14
import type { FileUpload } from 'graphql-upload/processRequest.mjs';
import type Upload from 'graphql-upload/Upload.mjs';
import sharp from 'sharp';

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { User } from '@/src/generated/prisma/client';
import { StorageService } from '@/src/modules/libs/storage/storage.service';

import { ChangeProfileInfoInput } from './inputs/change-profile-info.input';
import {
  SocialLinkInput,
  SocialLinkOrderInput,
} from './inputs/social-link.input';

@Injectable()
export class ProfileService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService
  ) {}

  public async changeAvatar(user: User, file: Upload | Promise<Upload>) {
    if (user.avatar) {
      await this.storageService.remove(user.avatar);
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
    const filename = `/channels/${user.username}.webp`;

    if (fileUpload.filename?.endsWith('.gif')) {
      const processedBuffer = await sharp(buffer, { animated: true })
        .resize(512, 512)
        .webp()
        .toBuffer();

      await this.storageService.upload(processedBuffer, filename, 'image/webp');
    } else {
      const processedBuffer = await sharp(buffer)
        .resize(512, 512)
        .webp()
        .toBuffer();

      await this.storageService.upload(processedBuffer, filename, 'image/webp');
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { avatar: filename },
    });

    return true;
  }

  public async removeAvatar(user: User) {
    if (!user.avatar) return;

    await this.storageService.remove(user.avatar);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { avatar: null },
    });

    return true;
  }

  public async changeInfo(user: User, input: ChangeProfileInfoInput) {
    const { username, displayName, bio } = input;

    const usernameExists = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (usernameExists && username !== user.username) {
      throw new ConflictException('Username was exists');
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { username, displayName, bio },
    });

    return true;
  }

  public async findSocialLinks(user: User) {
    return await this.prismaService.socialLink.findMany({
      where: { userId: user.id },
      orderBy: { position: 'asc' },
    });
  }

  public async createSocialLink(user: User, input: SocialLinkInput) {
    const { title, url } = input;

    const lastSocialLink = await this.prismaService.socialLink.findFirst({
      where: { userId: user.id },
      orderBy: { position: 'desc' },
    });

    const newPosition = lastSocialLink ? lastSocialLink.position + 1 : 1;

    await this.prismaService.socialLink.create({
      data: {
        title,
        url,
        position: newPosition,
        user: {
          connect: { id: user.id },
        },
      },
    });

    return true;
  }

  public async reorderSocialLinks(list: SocialLinkOrderInput[]) {
    if (!list.length) return;

    const updatePromises = list.map((socialLink) => {
      return this.prismaService.socialLink.update({
        where: { id: socialLink.id },
        data: { position: socialLink.position },
      });
    });

    await Promise.all(updatePromises);

    return true;
  }

  public async updateSocialLink(id: string, input: SocialLinkInput) {
    const { title, url } = input;

    await this.prismaService.socialLink.update({
      where: { id },
      data: { title, url },
    });

    return true;
  }

  public async removeSocialLink(id: string) {
    await this.prismaService.socialLink.delete({ where: { id } });

    return true;
  }
}
