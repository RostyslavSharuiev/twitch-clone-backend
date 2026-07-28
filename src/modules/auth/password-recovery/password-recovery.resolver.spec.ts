import { Test, TestingModule } from '@nestjs/testing';
import { PasswordRecoveryResolver } from './password-recovery.resolver';
import { PasswordRecoveryService } from './password-recovery.service';

describe('PasswordRecoveryResolver', () => {
  let resolver: PasswordRecoveryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordRecoveryResolver, PasswordRecoveryService],
    }).compile();

    resolver = module.get<PasswordRecoveryResolver>(PasswordRecoveryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
