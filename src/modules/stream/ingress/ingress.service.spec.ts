import { Test, TestingModule } from '@nestjs/testing';
import { IngressService } from './ingress.service';

describe('IngressService', () => {
  let service: IngressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngressService],
    }).compile();

    service = module.get<IngressService>(IngressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
