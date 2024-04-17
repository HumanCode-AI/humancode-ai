import crypto from 'crypto';

import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { HttpService } from '@nestjs/axios';
import { nanoid } from 'nanoid';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthHumancodeCallbackDto } from './dto/auth-humancode-callback.dto';
import { SocialInterface } from 'src/social/interfaces/social.interface';
import { UsersService } from 'src/users/users.service';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { validate, parse } from '@tma.js/init-data-node';
import { FaucetService } from 'src/faucet/faucet.service';

@Injectable()
export class AuthHumancodeService {
  private readonly logger = new Logger(AuthHumancodeService.name);

  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService,
    private readonly userService: UsersService,
    private readonly faucetService: FaucetService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async generateVerifyAndCallbackUrl(address?: string, initData?: string) {
    const cacheData = {}

    if (initData) {
      this.logger.log('verifyInitData')
      const tgUserId = this.verifyInitData(initData);
      this.logger.log('tgUserId: ', tgUserId)
      cacheData['tgUserId'] = tgUserId;
    }

    const sessionId = await this.getSessionId();
    const callbackUrl = this.configService.get('humancode.callbackUrl', {
      infer: true,
    })!;
    const apiHost = this.configService.get('humancode.apiHost', {
      infer: true,
    });

    if (address) {
      cacheData['address'] = address;
    }

    this.logger.log('cacheData: ', JSON.stringify(cacheData));
    if (Object.keys(cacheData).length > 0) {
      await this.cacheManager.set(sessionId, cacheData, 60 * 60 * 24 * 1000);
    }

    // ${address ? `&hash_id=${address}` : ''}
    const url = `${apiHost}/human_n_api/index.html?session_id=${sessionId}&callback_url=${encodeURIComponent(callbackUrl)}`;
    this.logger.log(`authUrl: ${url}`);
    return url;
  }

  async getProfileByToken(query: AuthHumancodeCallbackDto): Promise<SocialInterface> {
    const body = {
      session_id: query.session_id,
      vcode: query.vcode,
      timestamp: String(new Date().getTime()),
      nonce_str: nanoid(16),
    };
    this.logger.log(`getProfileByToken, body=${JSON.stringify(body)}`);
    const url = this.wrapApiUrl('api/vcode/v2/verify', body);
    const { data } = await firstValueFrom(
      this.httpService.post(url, body).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw 'An error happened!';
        }),
      ),
    );

    if (data.code === 0) {
      const { human_id } = data.result;
      // TODO:: add more fields
      return {
        id: human_id,
      }
    }
    throw 'An error happened!';
  }

  async updateUserInfo(uid: string, session_id: string) {
    this.logger.log('updateUserInfo: ', uid, session_id);
    const cacheData: any = await this.cacheManager.get(session_id);

    const user = await this.userService.findOne({
      id: uid
    })

    this.logger.log('cacheData: ', JSON.stringify(cacheData));

    let needUpdate = false;
    if (user && cacheData) {
      this.logger.log('===========>>> user && cacheData');
      if (!user.telegramUid && cacheData.tgUserId) {
        needUpdate = true;
        user.telegramUid = cacheData.tgUserId;
      }
      if (!user.address && cacheData.address) {
        needUpdate = true;
        user.address = cacheData.address;
      }
      if (!user.humancode && user.socialId) {
        const showIdRet = await this.getShowId(user.socialId);
        this.logger.log('showId=', JSON.stringify(showIdRet));
        needUpdate = true;
        user.humancode = showIdRet.show_id;
        user.humancodeTime = showIdRet.create_time;
      }
      if (needUpdate) {
        this.logger.log('update user, user=', JSON.stringify(user));
        await this.userService.update(uid, user);
      }
    }
  }

  async markAwardEligibility(uid: string) {
    await this.cacheManager.set(`mark-award-${uid}`, true, 60 * 60 * 24 * 1000);
  }

  async me(initData: string, address: string) {
    this.logger.log(`=======> me, iniData=${initData}, address=${address}`);
    // const tuid = this.verifyInitData(initData);
    const user = await this.userService.findOne({
      address: address
    })

    this.logger.log(`user=${JSON.stringify(user)}`);

    if (!user) {
      throw new UnauthorizedException('user is not exists');
    }

    if (user.status?.id !== StatusEnum.active) {
      throw new UnauthorizedException('user is not active');
    }

    const faucet = await this.faucetService.checkFaucet(user.id);
    const hasAward = await this.cacheManager.get(`mark-award-${user?.id}`);

    return {
      id: user?.id,
      isHuman: user?.socialId !== null,
      address: user?.address,
      claimAirdrop: faucet,
      hasAward: !!hasAward,
      humanCode: user?.humancode,
      issueDate: user?.humancodeTime,
    }
  }

  // async bindAddress(userJwtPayload: JwtPayloadType, body: AuthHumancodeBindAddressDto) {
  //   const session = await this.sessionService.findOne({
  //     id: userJwtPayload.sessionId,
  //   });

  //   if (!session) {
  //     throw new UnauthorizedException();
  //   }

  //   if (session.user.status?.id !== StatusEnum.active) {
  //     throw new UnauthorizedException('user is not active');
  //   }

  //   if (session.user.address) {
  //     throw new UnprocessableEntityException({
  //       status: HttpStatus.UNPROCESSABLE_ENTITY,
  //       errors: {
  //         hash: `user has already address`,
  //       },
  //     });
  //   }

  //   session.user.address = body.address;

  //   await this.userService.update(session.user.id, session.user);
  // }

  verifyInitData(initData: string)  {
    this.logger.log(initData);
    try {
      validate(initData, this.configService.get('telegram.botToken', {
        infer: true,
      })!)
      const result = parse(initData)
      if (!result.user) {
        throw 'telegram init data not found user';
      }
      return String(result.user.id)
    } catch (error) {
      this.logger.error(error);
      throw 'An error happened!';
    }
  }

  private async getSessionId() {
    const body = {
      timestamp: String(new Date().getTime()),
      nonce_str: nanoid(16),
    };
    const url = this.wrapApiUrl('api/session/v2/get_id', body);
    const { data } = await firstValueFrom(
      this.httpService.post(url, body).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw 'An error happened!';
        }),
      ),
    );

    if (data.code === 0) {
      const { session_id } = data.result;
      return session_id;
    }
    this.logger.error(data);
    throw 'An error happened!';
  }

  private async getShowId(humanHashId: string) {
    const body = {
      timestamp: String(new Date().getTime()),
      nonce_str: nanoid(16),
      human_id: humanHashId,
    };
    const url = this.wrapApiUrl('api/vcode/v2/get_show_id', body);
    const { data } = await firstValueFrom(
      this.httpService.post(url, body).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw 'An error happened!';
        }),
      ),
    );

    if (data.code === 0) {
      const { show_id, create_time } = data.result;
      return { show_id, create_time };
    }
    this.logger.error(data);
    throw 'An error happened!';
  }

  private wrapApiUrl(path: string, body: any) {
    const apiHost = this.configService.get('humancode.apiHost', {
      infer: true,
    });
    const appId = this.configService.get('humancode.appId', { infer: true });

    return `${apiHost}/${path}?app_id=${appId}&sign=${this.sign(body)}`;
  }

  private sign(data: any) {
    const body = JSON.stringify(data).replace(/,/g, ',').replace(/:/g, ':');
    const appKey = this.configService.get('humancode.appKey', { infer: true })!;
    const sign = crypto.createHmac('sha256', appKey).update(body).digest('hex');
    return sign;
  }
}
