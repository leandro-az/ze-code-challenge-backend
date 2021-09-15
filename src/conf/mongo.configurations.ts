import {createConnection, Connection,getConnection,ConnectionOptions} from 'typeorm';
import {Partner} from '../models/partner.model';

export async function getconnectionMongo(): Promise<Connection>{
  const options: ConnectionOptions = {
    type: 'mongodb',
    host: process.env.MONGO_HOST,
    port: parseInt(process.env.MONGO_PORT!,10),
    database:  process.env.MONGO_DATABASE,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    name: `DEFAULT_MONGO_${process.env.BRANCH}`,
    useUnifiedTopology: true,
    entities:[Partner],

  };

  try {
    const conn=  getConnection(options.name);
    return conn;
  } catch (error: any) {
    // LoggerUtils.log(LogLevelEnum.ERROR, '... @getconnectionMongo...',error);
    return (await createConnection(options));
  }
}
