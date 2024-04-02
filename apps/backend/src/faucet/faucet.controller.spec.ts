import { Test, TestingModule } from '@nestjs/testing';
import { FaucetController } from './faucet.controller';

describe('FaucetController', () => {
  let controller: FaucetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaucetController],
    }).compile();

    controller = module.get<FaucetController>(FaucetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
