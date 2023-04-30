import { ConfigService } from '@nestjs/config';
import { getRabbitMQConnectionString } from '@project/util/util-core';

export const getRabbitMQOptions = () => {
  return {
    useFactory: async (config: ConfigService) => ({
      exchanges: [
        {
          name: config.get(`rabbitmq.queue`) as string,
          type: 'direct',
        },
      ],
      uri: getRabbitMQConnectionString({
        host: config.get(`rabbitmq.host`) as string,
        password: config.get(`rabbitmq.password`) as string,
        user: config.get(`rabbitmq.user`) as string,
        port: config.get(`rabbitmq.port`) as number,
      }),
      connectionInitOptions: { wait: true },
      enableControllerDiscovery: true,
    }),
    inject: [ConfigService],
  };
};
