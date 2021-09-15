import { LoggerUtils } from './logger.utils';
import { LogLevelEnum } from '../enums/log-level.enums';

function tryJSONStringify(data: any) {
  try {
    return JSON.stringify(data);
  } catch (error: any) {
    return '[CIRCULAR JSON]';
  }
}

export namespace LogDecoratorUtils {
    export function LogMethod(logParams = false) {
      return (target: object, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor => {
        const method = propertyDesciptor.value;
        propertyDesciptor.value = function (...args: any[]) {
          let params = '';
          if (logParams) {
            params = tryJSONStringify(args);
          }
          LoggerUtils.log(LogLevelEnum.INFO, `...# @${target.constructor.name}/${propertyName}(${params})`);

          return method.apply(this, args);
        };
        return propertyDesciptor;
      };
    }
    export function LogAsyncMethod(logParams = false) {
      return (target: object, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor => {
        const method = propertyDesciptor.value;
        propertyDesciptor.value = async function (...args: any[]) {
          let params = '';
          if (logParams) {
            params = tryJSONStringify(args);
          }
          LoggerUtils.log(LogLevelEnum.INFO, `...# @${target.constructor.name}/${propertyName}(${params})`);

          return await method.apply(this, args);
        };
        return propertyDesciptor;
      };
    }
}
