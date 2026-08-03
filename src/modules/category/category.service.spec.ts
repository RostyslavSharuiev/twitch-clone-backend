import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/src/core/prisma/prisma.service';

import { CategoryService } from './category.service';

type MockPrismaService = {
  category: {
    findMany: jest.Mock;
    count: jest.Mock;
    findUnique: jest.Mock;
  };
};

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    prisma = {
      category: {
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('returns all categories', async () => {
    prisma.category.findMany.mockResolvedValue([{ id: 'c1' }]);

    await expect(service.findAll()).resolves.toEqual([{ id: 'c1' }]);
  });

  it('throws when category slug is missing', async () => {
    prisma.category.findUnique.mockResolvedValue(null);

    await expect(service.findBySlug('missing')).rejects.toThrow(
      NotFoundException
    );
  });
});
