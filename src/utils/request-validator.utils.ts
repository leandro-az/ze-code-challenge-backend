
import { validateSync } from 'class-validator';
import { plainToClass} from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
// import { ApiValidationError } from '../utils/errors-messages.util';
import { LoggerUtils } from './logger.utils';
import { LogDecoratorUtils } from './log-decorator.utils';
import { LogLevelEnum } from '../enums/log-level.enums';

export class RequestValidatorUtils {

    @LogDecoratorUtils.LogMethod(false)
  validateDTORequestBody<T>(dtoType: ClassType<T>, obj: any): T {
    const instance = plainToClass(dtoType, obj);
    const errors = validateSync(instance, {
      whitelist: true,
      validationError: {
        target: false,
        value: false
      }
    });
    if (errors &&errors.length) {
      LoggerUtils.log(LogLevelEnum.ERROR,'The request body is invalid.');
      throw new Error(JSON.stringify(errors))
    } else {
      LoggerUtils.log(LogLevelEnum.INFO,'The request body is valid.');
      return instance;
    }
  }

}
