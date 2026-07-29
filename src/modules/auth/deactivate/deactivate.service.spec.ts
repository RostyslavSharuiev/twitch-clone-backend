import { Test, TestingModule } from '@nestjs/testing';
import { DeactivateService } from './deactivate.service';

describe('DeactivateService', () => {
  let service: DeactivateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeactivateService],
    }).compile();

    service = module.get<DeactivateService>(DeactivateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
