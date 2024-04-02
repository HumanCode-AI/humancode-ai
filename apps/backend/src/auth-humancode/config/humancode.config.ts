import { registerAs } from '@nestjs/config';

import { IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { HumanCodeConfig } from './humancode-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  HUMANCODE_APP_ID: string;

  @IsString()
  HUMANCODE_APP_KEY: string;

  @IsString()
  HUMANCODE_API_HOST: string;

  @IsString()
  HUMANCODE_CALLBACK_URL: string;
}

export default registerAs<HumanCodeConfig>('humancode', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    appId: process.env.HUMANCODE_APP_ID!,
    appKey: process.env.HUMANCODE_APP_KEY!,
    apiHost: process.env.HUMANCODE_API_HOST!,
    callbackUrl: process.env.HUMANCODE_CALLBACK_URL!,
  };
});
