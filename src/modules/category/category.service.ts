import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/src/core/prisma/prisma.service';

@Injectable()
export class CategoryService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async findAll() {
    return await this.prismaService.category.findMany({
      where: {
        createdAt: 'desc',
      },
      include: {
        streams: {
          include: {
            user: true,
            category: true,
          },
        },
      },
    });
  }

  public async findRandom() {
    const total = await this.prismaService.category.count();

    const randomIndexList = new Set<number>();

    while (randomIndexList.size < 7) {
      const randomIndex = Math.floor(Math.random() * total);

      randomIndexList.add(randomIndex);
    }

    const categoryList = await this.prismaService.category.findMany({
      include: {
        streams: {
          include: {
            user: true,
            category: true,
          },
        },
      },
      skip: 0,
      take: total,
    });

    return Array.from(randomIndexList).map((index) => categoryList[index]);
  }

  public async findBySlug(slug: string) {
    const category = await this.prismaService.category.findUnique({
      where: {
        slug,
      },
      include: {
        streams: {
          include: {
            user: true,
            category: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category is not found');
    }

    return category;
  }
}
