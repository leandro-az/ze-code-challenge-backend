import {createConnection, Connection,getConnection,ConnectionOptions} from 'typeorm';

export async function getconnectionMongo(): Promise<Connection>{
  const options: ConnectionOptions = {
    type: 'mongodb',
    host: process.env.MONGO_HOST,
    port: parseInt(process.env.MONGO_PORT!,10),
    database:  process.env.MONGO_DATABASE,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    name: 'DEFAULT_MONGO'
  };
  try {
    return getConnection(options.name);
  } catch (error) {
    return (await createConnection(options));
  }
}
