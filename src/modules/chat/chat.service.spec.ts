import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/src/core/prisma/prisma.service';

import { ChatService } from './chat.service';

type MockPrismaService = {
  chatMessage: {
    findMany: jest.Mock;
    create: jest.Mock;
  };
  stream: {
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

describe('ChatService', () => {
  let service: ChatService;
  let prisma: MockPrismaService;

  beforeEach(async () => {
    prisma = {
      chatMessage: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
      stream: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('finds messages for a stream', async () => {
    prisma.chatMessage.findMany.mockResolvedValue([{ id: 'm1' }]);

    await expect(service.findByStream('s1')).resolves.toEqual([{ id: 'm1' }]);
  });

  it('throws when stream is not found', async () => {
    prisma.stream.findUnique.mockResolvedValue(null);

    await expect(
      service.sendMessage('u1', { text: 'hi', streamId: 's1' })
    ).rejects.toThrow(NotFoundException);
  });

  it('throws when stream is not live', async () => {
    prisma.stream.findUnique.mockResolvedValue({ id: 's1', isLive: false });

    await expect(
      service.sendMessage('u1', { text: 'hi', streamId: 's1' })
    ).rejects.toThrow(BadRequestException);
  });
});
