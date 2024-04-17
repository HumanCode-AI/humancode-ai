import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  Redirect,
  Res,
  Headers,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthHumancodeService } from './auth-humancode.service';
import { AuthHumancodeCallbackDto } from './dto/auth-humancode-callback.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthHumancodeMiniLoginQueryDto } from './dto/auth-humancode-mini-login-query.dto';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

@ApiTags('Auth')
@Controller({
  path: 'auth/humancode',
  version: '1',
})
export class AuthHumancodeController {
  private readonly logger = new Logger(AuthHumancodeController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly authHumancodeService: AuthHumancodeService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  @Get('mini/me')
  @HttpCode(HttpStatus.OK)
  async me(@Headers('telegram-init-data') initData: string, @Query('address') address: string): Promise<any> {
    this.logger.log('humancode mini me', initData);
    const result = await this.authHumancodeService.me(initData, address);
    this.logger.log('result: ', JSON.stringify(result));
    return result;
  }

  @Get('mini/login')
  @Redirect()
  async login(@Query() query: AuthHumancodeMiniLoginQueryDto): Promise<any> {
    this.logger.log('humancode mini login', JSON.stringify(query));
    let bufferObj = Buffer.from(query.initData, "base64"); 
    let decodedString = bufferObj.toString("utf8"); 
    return {
      url: await this.authHumancodeService.generateVerifyAndCallbackUrl(
        query.address,
        decodedString,
      ),
    };
  }

  @Get('callback')
  @Redirect()
  async callback(
    @Res({ passthrough: true }) response: Response,
    @Query() query: AuthHumancodeCallbackDto,
  ) {
    this.logger.log('humancode ai callback', JSON.stringify(query));
    const socialData = await this.authHumancodeService.getProfileByToken(query);
    const jwtRet = await this.authService.validateSocialLogin('humancode', socialData);
    response.cookie('authToken', jwtRet.token)
    await this.authHumancodeService.updateUserInfo(jwtRet.user.id, query.session_id);
    this.logger.log('jwtRet: ', JSON.stringify(jwtRet));
    this.logger.log('markAwardEligibility, uid=', jwtRet.user.id);
    await this.authHumancodeService.markAwardEligibility(jwtRet.user.id);
    return {
      url: this.configService.get('telegram.webappLink', {
        infer: true,
      })
    }
  }
}
