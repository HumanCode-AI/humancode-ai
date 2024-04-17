import { AppConfig } from './app-config.type';
import { AuthConfig } from '../auth/config/auth-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { FileConfig } from '../files/config/file-config.type';
import { MailConfig } from '../mail/config/mail-config.type';
import { HumanCodeConfig } from '../auth-humancode/config/humancode-config.type';
import { TelegramConfig } from './telegram-config';
import { TonConfig } from './ton-config';

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  file: FileConfig;
  mail: MailConfig;
  humancode: HumanCodeConfig;
  telegram: TelegramConfig;
  ton: TonConfig;
};
