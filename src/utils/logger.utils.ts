import { LogLevelEnum } from '../enums/log-level.enums';
import moment from 'moment';

export namespace LoggerUtils {
    export function log(
      logLevel: LogLevelEnum,
      logMessage: string, logErrorStack?: Error): void {
      let logStructure: any;
      const logDateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

      if (logLevel === LogLevelEnum.INFO) {
        logStructure = {
          DATE: logDateTime,
          LEVEL: logLevel,
          MESSAGE: logMessage
        };
      } else {
        logStructure = {
          'DATE': logDateTime,
          'LEVEL': logLevel,
          'MESSAGE': logMessage,
          'STACK TRACE': logErrorStack === undefined ? '' : logErrorStack.stack
        };
      }

      console.log(JSON.stringify(logStructure));
    }
}
