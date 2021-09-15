
import {PartnerRepository} from '../repositories/partner.repository';
import {PartnertDTO} from '../dtos/partner.dto';
import {PointDTO} from '../dtos/point.dto'
import {PartnerHelper} from '../helpers/partner.helper';
import {ResponseSearchPartnerByIdDTO} from '../dtos/response-body-search-partner-by-id.dto';
import { LogDecoratorUtils } from '../utils/log-decorator.utils';
import { LoggerUtils} from '../utils/logger.utils';
import {LogLevelEnum} from '../enums/log-level.enums';
import { Partner } from '../models/partner.model';
import {distance} from '@turf/turf';

export class PartnerService{
  /**
   * @description Search a partner by Id.
   * Then prepare and transform de Partner to a DTO and send in response body
   * @param id Used like a filter to find a partner in collection.
   */
  @LogDecoratorUtils.LogAsyncMethod()
  async findPartnerById(id: string): Promise<ResponseSearchPartnerByIdDTO>{
    const partnerRepository: PartnerRepository= new PartnerRepository()
    const partnerHelper: PartnerHelper= new PartnerHelper()
    try {
      const partner= await partnerRepository.findByIdExternal(id);
      return partnerHelper.generateResponseBodyToRecoveryPartnerByIdSuccessfully(partner)
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, '... @PartnerService/findPartnerById',error);
      return partnerHelper.generateResponseBodyToResquestPartnerByIdFail()
    }
  }
  /**
   * @description filter closest partner from target adress.
   * @param targetAdress Used like a filter to find a partner closer then in a list of partners.
   * @param partnerList List of all partner that include this target adress
   */

  @LogDecoratorUtils.LogMethod()
  private getCloserAdress(targetAdress: number[],partnerList: Partner[]): Partner{
    let closer: Partner=partnerList[0];
    let dist= distance(targetAdress,closer.addressPoint.coordinates)
    for(const partner of partnerList){
      const tempdist=distance(targetAdress,partner.addressPoint.coordinates)
      if(tempdist<dist){
        dist=tempdist
        closer=partner
      }
    }
    return closer
  }

  /**
   * @description Search a partner by Localization.
   * Then prepare and transform de Partner to a DTO and send in response body
   * @param pointDTO Used to find partner closer of one adress.
   */

  @LogDecoratorUtils.LogAsyncMethod()
  async findPartnerByLocalization(pointDTO: PointDTO): Promise<ResponseSearchPartnerByIdDTO>{
    const partnerRepository: PartnerRepository= new PartnerRepository()
    const partnerHelper: PartnerHelper= new PartnerHelper()
    try {

      const partners= await partnerRepository.findManyIncludingCoord(pointDTO.coordinates);
      if(partners && partners.length){
        const partnerResul= this.getCloserAdress(pointDTO.coordinates,partners);
        return partnerHelper.generateResponseBodyToRecoveryPartnerByIdSuccessfully(partnerResul)
      }else{
        return partnerHelper.generateResponseBodyToResquestPartnerByIdFail('No Partner Found!')
      }

    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, '... @PartnerService/findPartnerByLocalization',error);
      return partnerHelper.generateResponseBodyToResquestPartnerByIdFail()
    }
  }

  /**
   * @description Insert One Partner on collection.
   * Verify if this Partner already exists by document
   * Prepare the Partner to insert;
   * Insert
   * Then prepare and transform de Partner to a DTO and send to response
   * @param partnerDTO The partner we want to insert.
   */
  @LogDecoratorUtils.LogAsyncMethod()
  async insertOnePartner(partnerDTO: PartnertDTO): Promise<ResponseSearchPartnerByIdDTO>{
    const partnerRepository: PartnerRepository= new PartnerRepository()
    const partnerHelper: PartnerHelper= new PartnerHelper()
    try {
      const partnerFound = await partnerRepository.findByIdOrDocument(`${partnerDTO.id}`,partnerDTO.document)
      if(partnerFound && partnerFound.length){
        return partnerHelper.generateResponseBodyToResquestPartnerDuplicatedFail()
      }
      const partnerToInsert= partnerHelper.convertPartnerDtoToPartner(partnerDTO);
      await partnerRepository.insertOne(partnerToInsert);
      return partnerHelper.generateResponseBodyToCreatePartnerSuccessfully(partnerToInsert)
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, '... @PartnerService/findPartnerById',error);
      return partnerHelper.generateResponseBodyToCreatePartnerFail()
    }
  }
  /**
   * @description Insert May Partner on collection.
   * Auxiliar method to fill collection
   * Call one by one the insertOnePartner
   * @param partnersDTO The list of partners we want to insert.
   */
  @LogDecoratorUtils.LogAsyncMethod()
  async insertManyPartners(partnersDTO: PartnertDTO[]): Promise<boolean>{
    try {
      LoggerUtils.log(LogLevelEnum.INFO, '... @PartnerService/insertManyPartners/init......');
      for (const partnerDTO of  partnersDTO) {
        await this.insertOnePartner(partnerDTO)
      }
      const partnerRepository: PartnerRepository= new PartnerRepository()
      await partnerRepository.createIndex();
      LoggerUtils.log(LogLevelEnum.INFO, '... @PartnerService/insertManyPartners/finished......');
      return true
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, '... @PartnerService/insertManyPartners',error);
      return false
    }


  }
}
