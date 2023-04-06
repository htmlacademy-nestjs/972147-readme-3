export type MongoConnectionOptions = {
  username: string;
  password: string;
  host: string;
  port: number;
  databaseName: string;
  authDatabase: string;
};

export const getMongoConnectionString = (options: MongoConnectionOptions): string => {
  const {username, password, host, port, databaseName, authDatabase} = options;
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=${authDatabase}`;
};
