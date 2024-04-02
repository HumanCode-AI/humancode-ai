import { Test, TestingModule } from '@nestjs/testing';
import { FaucetService } from './faucet.service';

describe('FaucetService', () => {
  let service: FaucetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaucetService],
    }).compile();

    service = module.get<FaucetService>(FaucetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
