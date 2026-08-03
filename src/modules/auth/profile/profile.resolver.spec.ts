import { Test, TestingModule } from '@nestjs/testing';

import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

describe('ProfileResolver', () => {
  let resolver: ProfileResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileResolver,
        {
          provide: ProfileService,
          useValue: {
            changeAvatar: jest.fn(),
            removeAvatar: jest.fn(),
            changeInfo: jest.fn(),
            findSocialLinks: jest.fn(),
            createSocialLink: jest.fn(),
            reorderSocialLinks: jest.fn(),
            updateSocialLink: jest.fn(),
            removeSocialLink: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ProfileResolver>(ProfileResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
