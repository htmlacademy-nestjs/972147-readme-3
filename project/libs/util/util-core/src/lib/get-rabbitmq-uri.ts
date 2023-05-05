export type RabbitMQConnectionOptions = {
  user: string;
  password: string;
  host: string;
  port: number;
};

export const getRabbitMQConnectionString = ({ user, password, host, port }: RabbitMQConnectionOptions): string => {
  return `amqp://${user}:${password}@${host}:${port}`;
};
