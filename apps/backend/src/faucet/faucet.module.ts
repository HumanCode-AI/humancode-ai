import { Module } from '@nestjs/common';
import { FaucetService } from './faucet.service';
import { FaucetController } from './faucet.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ConfigModule, HttpModule, UsersModule],
  controllers: [FaucetController],
  providers: [FaucetService],
})
export class FaucetModule {}
