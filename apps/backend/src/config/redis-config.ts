import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService, registerAs } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";
import { IsString } from "class-validator";
import validateConfig from "src/utils/validate-config";

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      url: configService.getOrThrow('redis.url', { infer: true }),
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};

export type RedisConfig = {
  url: string;
};

class EnvironmentVariablesValidator {
  @IsString()
  REDIS_URL: string;
}

export default registerAs<RedisConfig>('redis', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    url: process.env.REDIS_URL!
  };
});
