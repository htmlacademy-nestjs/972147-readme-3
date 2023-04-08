import { getMongoConnectionString } from '@project/util/util-core';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export const getMongoOptions = (): MongooseModuleAsyncOptions => {
  return {
    useFactory: async (config: ConfigService) => {
      return {
        uri: getMongoConnectionString({
          username: config.get('db.user') as string,
          password: config.get<string>('db.password') as string,
          host: config.get<string>('db.host') as string,
          port: config.get<number>('db.port') as number,
          authDatabase: config.get<string>('db.authBase') as string,
          databaseName: config.get<string>('db.name') as string,
        })
      }
    },
    inject: [ConfigService]
  }
};
