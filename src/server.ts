import appFactory from './app';
import * as express from 'express';
import { LoggerUtils} from './utils/logger.utils';
import {LogLevelEnum} from './enums/log-level.enums';


async function init() {
  try {
    const app: express.Application = await appFactory()
    app.listen(process.env.APP_PORT)
    LoggerUtils.log(LogLevelEnum.INFO,`===========Server is running on port: ${process.env.APP_PORT} ==========`)
  } catch (error: any) {
    LoggerUtils.log(LogLevelEnum.ERROR, '... @Server/init',error);
  }
}

init()
