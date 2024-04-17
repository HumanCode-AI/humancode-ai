import { registerAs } from "@nestjs/config";
import { IsString, isString } from "class-validator";
import validateConfig from "src/utils/validate-config";

export type TonConfig = {
  rpcApi: string;
  apiKey: string;
  senderMnemonic: string;
  senderAddress: string;
};

class EnvironmentVariablesValidator {
  @IsString()
  TON_CENTER_RPC_API: string;
  
  @IsString()
  TON_CENTER_API_KEY: string;
  
  @IsString()
  TON_SENDER_MNEMONIC: string;

  @IsString()
  TON_SENDER_ADDRESS: string;
}

export default registerAs<TonConfig>('ton', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    rpcApi: process.env.TON_CENTER_RPC_API!,
    apiKey: process.env.TON_CENTER_API_KEY!,
    senderMnemonic: process.env.TON_SENDER_MNEMONIC!,
    senderAddress: process.env.TON_SENDER_ADDRESS!
  };
});
