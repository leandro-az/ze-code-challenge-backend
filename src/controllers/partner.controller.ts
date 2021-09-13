

import {PartnerService} from '../services/partner.service';
import {RequestCreateOnePartnerDTO} from '../dtos/request-body-create-one-partner';
import {RequestBodySearchPartnertDTO} from '../dtos/request-body-search-partners-by-adress.dto';
import {RequestCreateManyPartnersDTO} from '../dtos/request-body-create-many-partners';
import { LogDecoratorUtils } from '../utils/log-decorator.utils';
import { LoggerUtils} from '../utils/logger.utils';
import {LogLevelEnum} from '../enums/log-level.enums';
import {RequestValidatorUtils} from '../utils/request-validator.utils';
import { NextFunction, Request, Response } from 'express';
import pdvs from '../../files/pdvs.json';
export class PartnerController{
  @LogDecoratorUtils.LogAsyncMethod()
  async findPartnerById(req: Request, res: Response, next: NextFunction): Promise<any>{
    try {
      const partnerService: PartnerService= new PartnerService();
      const partenetId: string = req.query.partenetId as string
      const result= await partnerService.findPartnerById(partenetId);
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
      const partnerService: PartnerService= new PartnerService();
      const requestValidatorUtils:  RequestValidatorUtils=  new RequestValidatorUtils()
      const requestCreatePartnersDTO: RequestCreateOnePartnerDTO = requestValidatorUtils.validateDTORequestBody(RequestCreateOnePartnerDTO,req.body)
      const result= await partnerService.insertOnePartner(requestCreatePartnersDTO.pdv);
      return res
        .status(result.statusCode)
        .json(result)
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, '... @PartnerController/insertOnePartner',error);
      next(error)
    }
  }

  @LogDecoratorUtils.LogAsyncMethod()
  async insertManyPartners(_req: Request, res: Response, next: NextFunction): Promise<any>{
    try {
      const partnerService: PartnerService= new PartnerService();
      const requestValidatorUtils:  RequestValidatorUtils=  new RequestValidatorUtils()
      const requestCreateManyPartnersDTO: RequestCreateManyPartnersDTO = requestValidatorUtils.validateDTORequestBody(RequestCreateManyPartnersDTO,pdvs)
      partnerService.insertManyPartners(requestCreateManyPartnersDTO.pdvs);
      return res
        .status(200)
        .json({message:'Processo Iniciado!'})
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, '... @PartnerController/insertManyPartners',error);
      next(error)
    }
  }

  @LogDecoratorUtils.LogAsyncMethod()
  async findPartnerByLocalization(req: Request, res: Response, next: NextFunction): Promise<any>{
    try {
      const partnerService: PartnerService= new PartnerService();
      const requestValidatorUtils:  RequestValidatorUtils=  new RequestValidatorUtils()
      const requestBodySearchPartnertDTO: RequestBodySearchPartnertDTO = requestValidatorUtils.validateDTORequestBody(RequestBodySearchPartnertDTO,req.body)
      const result= await partnerService.findPartnerByLocalization(requestBodySearchPartnertDTO.targetAddress);
      return res
        .status(result.statusCode)
        .json(result)
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, '... @PartnerController/findPartnerByLocalization',error);
      next(error)
    }
  }
}
