import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class HomeService {
  private readonly logger = new Logger(HomeService.name);

  constructor(private configService: ConfigService<AllConfigType>) {}

  appInfo() {
    return { name: this.configService.get('app.name', { infer: true }) };
  }
}
