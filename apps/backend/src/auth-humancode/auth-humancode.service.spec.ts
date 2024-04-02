import { Test, TestingModule } from '@nestjs/testing';
import { AuthHumancodeService } from './auth-humancode.service';

describe('AuthHumancodeService', () => {
  let service: AuthHumancodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthHumancodeService],
    }).compile();

    service = module.get<AuthHumancodeService>(AuthHumancodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
