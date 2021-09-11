
import {Service} from 'typedi';
import {PartnerService} from '../services/partner.service';
import {RequestCreateOnePartnerDTO} from '../dtos/request-body-create-one-partner';
import { LogDecoratorUtils } from '../utils/log-decorator.utils';
import { LoggerUtils} from '../utils/logger.utils';
import {LogLevelEnum} from '../enums/log-level.enums';
import {RequestValidatorUtils} from '../utils/request-validator.utils';
import { NextFunction, Request, Response } from 'express';

Service()
export class PartnerController{
  constructor(
        private readonly partnerService: PartnerService,
        private readonly requestValidatorUtils: RequestValidatorUtils
  ) {
  }
  @LogDecoratorUtils.LogAsyncMethod()
  async findPartnerById(req: Request, res: Response, next: NextFunction): Promise<any>{
    try {
      const partenetId: string = req.query.partenetId as string
      const result= await this.partnerService.findPartnerById(partenetId);
      return res
        .status(result.statusCode)
        .json(result)
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, '... @PartnerController/findPartnerById',error);
      next(error)
    }
  }

  @LogDecoratorUtils.LogAsyncMethod()
  async insertOnePartner(req: Request, res: Response, next: NextFunction): Promise<any>{
    try {
      const requestCreatePartnersDTO: RequestCreateOnePartnerDTO = this.requestValidatorUtils .validateDTORequestBody(RequestCreateOnePartnerDTO,req.body)
      const result= await this.partnerService.insertOnePartner(requestCreatePartnersDTO.pdv);
      return res
        .status(result.statusCode)
        .json(result)
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, '... @insertOnePartner/findPartnerById',error);
      next(error)
    }
  }
}
