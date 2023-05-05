import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { getRedisConnectionString } from '@project/util/util-core';

export const getRedisOptions = () => {
  return {
    useFactory: async (config: ConfigService) => {
      console.log(getRedisConnectionString({
        host: config.get(`redis.host`) as string,
        password: config.get(`redis.password`) as string,
        port: config.get(`redis.port`) as number,
      }));
      const store = await redisStore({
        url: getRedisConnectionString({
          host: config.get(`redis.host`) as string,
          password: config.get(`redis.password`) as string,
          port: config.get(`redis.port`) as number,
        }),
        database: 0,
      });
      return { store };
    },
    inject: [ConfigService],
  };
};
