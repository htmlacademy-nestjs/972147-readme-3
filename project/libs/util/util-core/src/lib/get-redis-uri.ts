export type RedisConnectionOptions = {
  password: string;
  host: string;
  port: number;
};

export const getRedisConnectionString = ({ password, host, port }: RedisConnectionOptions): string => {
  return `redis://:${password}@${host}:${port}`;
};
