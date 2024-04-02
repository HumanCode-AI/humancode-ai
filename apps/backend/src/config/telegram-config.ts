import { registerAs } from "@nestjs/config";
import { IsString } from "class-validator";
import validateConfig from "src/utils/validate-config";

export type TelegramConfig = {
  botName: string;
  botToken: string;
  webappLink: string;
};

class EnvironmentVariablesValidator {
  @IsString()
  TELEGRAM_BOT_NAME: string;
  
  @IsString()
  TELEGRAM_BOT_TOKEN: string;
  
  @IsString()
  TELEGRAM_WEBAPP_LINK: string;
}

export default registerAs<TelegramConfig>('telegram', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    botName: process.env.TELEGRAM_BOT_NAME!,
    botToken: process.env.TELEGRAM_BOT_TOKEN!,
    webappLink: process.env.TELEGRAM_WEBAPP_LINK!
  };
});
