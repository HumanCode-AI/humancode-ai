import { Test, TestingModule } from '@nestjs/testing';
import { AuthHumancodeController } from './auth-humancode.controller';

describe('AuthHumancodeController', () => {
  let controller: AuthHumancodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthHumancodeController],
    }).compile();

    controller = module.get<AuthHumancodeController>(AuthHumancodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
