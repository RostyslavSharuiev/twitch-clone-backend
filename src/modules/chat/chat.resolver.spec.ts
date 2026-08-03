import { Test, TestingModule } from '@nestjs/testing';

import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';

describe('ChatResolver', () => {
  let resolver: ChatResolver;
  let chatService: {
    findByStream: jest.Mock;
    sendMessage: jest.Mock;
    changeSettings: jest.Mock;
  };

  beforeEach(async () => {
    chatService = {
      findByStream: jest.fn(),
      sendMessage: jest.fn(),
      changeSettings: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatResolver,
        { provide: ChatService, useValue: chatService },
      ],
    }).compile();

    resolver = module.get<ChatResolver>(ChatResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
