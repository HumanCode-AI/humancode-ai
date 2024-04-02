import { Module } from '@nestjs/common';
import { AuthHumancodeController } from './auth-humancode.controller';
import { AuthHumancodeService } from './auth-humancode.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';
import { SessionModule } from 'src/session/session.module';
import { UsersModule } from 'src/users/users.module';
import { FaucetService } from 'src/faucet/faucet.service';

@Module({
  imports: [ConfigModule, HttpModule, AuthModule, SessionModule, UsersModule],
  controllers: [AuthHumancodeController],
  providers: [AuthHumancodeService, FaucetService],
})
export class AuthHumancodeModule {}
