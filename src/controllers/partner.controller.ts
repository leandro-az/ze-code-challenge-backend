

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
  /**
   * @description Recovery Partner by Id
   * Recive the partner id from request.
   */
  @LogDecoratorUtils.LogAsyncMethod()
  async findPartnerById(req: Request, res: Response, next: NextFunction): Promise<any>{
    try {
      const partnerService: PartnerService= new PartnerService();
      const partnerId: string = req.params.id as string;
      const result= await partnerService.findPartnerById(partnerId);
      return res
        .status(result.statusCode)
        .json(result)
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, '... @PartnerController/findPartnerById',error);
      next(error)
    }
  }
  /**
   * @description Insert one Partner
   * Recive the partner in body from request.
   * Try validate Type with request validator utils and  call service with params
   */
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

  /**
   * @description This method fill the database with many partnes loads from file in /files
   */

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

  /**
   * @description Recovery Partner closer one localization
   * Recive the Point localization in body of requisition.
   */

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
