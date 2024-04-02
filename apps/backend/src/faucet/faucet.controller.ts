import { Controller, Post, HttpCode, HttpStatus, Body, Logger } from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';
import FaucetTakeBodyDto from './dto/faucet-take-body.dto';
import { FaucetService } from './faucet.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Faucet')
@Controller({
  path: 'faucet',
  version: '1',
})
export class FaucetController {
  private readonly logger = new Logger(FaucetController.name);
  constructor(private readonly faucetService: FaucetService) {}

  @Post('take')
  @HttpCode(HttpStatus.OK)
  async take(@RealIP() ip: string, @Body() body: FaucetTakeBodyDto): Promise<string> {
    return this.faucetService.take(ip, body.initData);
  }
}
