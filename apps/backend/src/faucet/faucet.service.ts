import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { UsersService } from 'src/users/users.service';
import { FaucetEntity } from './infrastructure/persistence/relational/entities/faucet.entity';
import TonWeb from 'tonweb';
import { mnemonicToSeed } from 'tonweb-mnemonic';
import { sleep } from 'src/utils/utils';
import { validate } from 'class-validator';
import { parse } from '@tma.js/init-data-node';

const RPC_API = 'https://testnet.toncenter.com/api/v2/jsonRPC';
const API_KEY = '46decbda639902551808878fea335fc85a2bef0f2b2ede8ecb638e2734a85a46';
const tonweb = new TonWeb(new TonWeb.HttpProvider(RPC_API, { apiKey: API_KEY}));
// 助记词
const MNEMONIC = 'soldier quick quiz cement address jeans pen ostrich faith champion stone upon boring shop lend enlist pear ceiling gesture fantasy nerve energy disease dizzy'.split(' ');
const FAUCET_ADDRESS = 'EQCTuiT5W4qq7Q7evc2h8pnTXfB3Cz0agv2KV0bkLwozSMD9'

@Injectable()
export class FaucetService {
  private readonly logger = new Logger(FaucetService.name);

  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService,
    private readonly userService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async take(ip: string, initData: string) {
    const tgUserId = this.verifyInitData(initData);
    if (!tgUserId) {
      throw new BadRequestException('init data invalid');
    }

    const user = await this.userService.findOne({
      telegramUid: tgUserId
    })

    if (!user) {
      throw new BadRequestException('user is not exists');
    }

    if (user.status?.id !== StatusEnum.active) {
      throw new BadRequestException('user is not active');
    }

    // 检查用户是否已经领取过
    const faucets = await FaucetEntity.findOneBy({
      userId: user.id
    });

    this.logger.log('faucets: ', JSON.stringify(faucets));

    const hasAward = await this.cacheManager.get(`mark-award-${user?.id}`);
    if (!hasAward) {
      throw new BadRequestException('Please identify the palm print first');
    }
    // if (faucets) {
    //   throw new BadRequestException('user has taken');
    // }

    if (!user.address) {
      throw new BadRequestException('user address is not exists');
    }

    const faucetCacheKey = `faucet:${tgUserId}`;
    await this.cacheManager.set(faucetCacheKey, tgUserId, 30 * 1000);

    // 发送奖励
    const txHash = await this.sendReward(user.address);

    if (!txHash) {
      throw new BadRequestException('send reward failed');
    }

    // 删除资格缓存
    await this.cacheManager.del(`mark-award-${user?.id}`);

    // 入库
    await FaucetEntity.create({
      from: FAUCET_ADDRESS,
      to: user.address,
      amount: 1,
      currency: 'TON',
      source: 'tg-faucet',
      txHash,
      userId: user.id,
      ip
    }).save();

    return txHash;
  }

  async checkFaucet(uid: string) {
    // 检查用户是否已经领取过
    const faucet = await FaucetEntity.findOneBy({
      userId: uid
    });

    return faucet?.txHash;
  }

  // 发送奖励
  private async sendReward(address: string) {
    const seed = await mnemonicToSeed(MNEMONIC)
    this.logger.log('seed Hex: ', TonWeb.utils.bytesToHex(seed));
    
    // 密钥对
    const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);
    // 使用v4R2
    const WalletClass = tonweb.wallet.all['v3R2'];
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0
    });

    const walletAddress = await wallet.getAddress();
    const WALLET_ADDRESS = walletAddress.toString(true, true, true);
    console.log('钱包地址:' , WALLET_ADDRESS);

    // let walletInfo = await tonweb.provider.getAddressInfo(WALLET_ADDRESS);
    // this.logger.log('walletInfo: ', walletInfo);

    // wallet seqno get method
    const seqno = (await wallet.methods.seqno().call()) || 0;
    this.logger.log('wallet seqno = ', seqno);

    let lastTx = await this.getLastTransaction(WALLET_ADDRESS);
    console.log('lastTxHash: ', lastTx?.txHash);
    console.log('lastTxHashHex: ', lastTx?.txHashHex);

    await this.transfer(wallet, keyPair.secretKey, address, seqno);

    let curTx = lastTx;
    while (curTx?.txHash == lastTx?.txHash) {
      await sleep(1500);
      curTx = await this.getLastTransaction(WALLET_ADDRESS);
    }

    console.log('success txHash: ', curTx?.txHash);

    return curTx?.txHashHex;
  }

  private async transfer(wallet: any, secretKey: any, toAddress: string, seqno: any) {
    const transfer = wallet.methods.transfer({
      secretKey: secretKey,
      toAddress: toAddress,
      amount: TonWeb.utils.toNano('0.01'), // 0.01 TON
      seqno: seqno || 0,
      payload: 'HumancodeAI faucet transfer',
      sendMode: 3,
    });
    const result = await transfer.send();
    console.log('simpleTransfer', result);
  }

  private async getLastTransaction(walletAddress: string) {
    const transactions = await tonweb.getTransactions(walletAddress, 1);
    if (transactions instanceof Array) {
      const result = {
        trade: transactions[0],
        txHash: transactions[0].transaction_id.hash,
        txHashHex: '',
      }

      if (result.trade) {
        const base64Buffer = Buffer.from(result.trade.transaction_id.hash, 'base64');
        const hexString = base64Buffer.toString('hex');
        result['txHashHex'] = hexString
      }

      return result;
    }
    return undefined
  }

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
}
