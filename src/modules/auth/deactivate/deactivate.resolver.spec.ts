import { Test, TestingModule } from '@nestjs/testing';
import { DeactivateResolver } from './deactivate.resolver';
import { DeactivateService } from './deactivate.service';

describe('DeactivateResolver', () => {
  let resolver: DeactivateResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeactivateResolver, DeactivateService],
    }).compile();

    resolver = module.get<DeactivateResolver>(DeactivateResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
