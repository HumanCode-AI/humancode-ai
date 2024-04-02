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

@ApiTags('Auth')
@Controller({
  path: 'auth/humancode',
  version: '1',
})
export class AuthHumancodeController {
  private readonly logger = new Logger(AuthHumancodeController.name);

  constructor(private readonly authService: AuthService, private readonly authHumancodeService: AuthHumancodeService) {}

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  // @SerializeOptions({
  //   groups: ['me'],
  // })
  // @Post('bind')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async bind(@Request() request, @Body() body: AuthHumancodeBindAddressDto): Promise<void> {
  //   return this.authHumancodeService.bindAddress(request.user, body);
  // }
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

  // @Get('callback_bak')
  // @Redirect()
  // async callback_bak(
  //   @RealIP() ip: string,
  //   @Headers('User-Agent') userAgent: string,
  //   @Query() query: AuthHumancodeCallbackDto,
  // ) {
  //   this.logger.log('humancode ai callback', userAgent, JSON.stringify(query));
  //   const humanId = await this.authHumancodeService.verify(
  //     query,
  //     ip,
  //     userAgent,
  //   );
  //   return {
  //     url: `http://localhost:1000/auth/success/${humanId}`,
  //   };
  // }

  @Get('callback')
  @Redirect()
  async callback(
    @Res({ passthrough: true }) response: Response,
    // @RealIP() ip: string,
    // @Headers('User-Agent') userAgent: string,
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
      url: 'https://t.me/uhumancodeai_bot/app'
    }
  }
}
