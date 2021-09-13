
import appFactory from './app';
import { LoggerUtils} from './utils/logger.utils';
import {LogLevelEnum} from './enums/log-level.enums';
import {Application} from 'express';
import * as dotenv from 'dotenv';


async function init() {
  try {
    dotenv.config()
    const app: Application= await appFactory()
    app.listen(process.env.APP_PORT)
    LoggerUtils.log(LogLevelEnum.INFO,`===========Server is running on port: ${process.env.APP_PORT} ==========`)
  } catch (error: any) {
    LoggerUtils.log(LogLevelEnum.ERROR, '... @Server/init',error);
  }
}

init()
