
import {PartnerRepository} from '../repositories/partner.repository';
import {PartnertDTO} from '../dtos/partner.dto';
import {PointDTO} from '../dtos/point.dto'
import {PartnerHelper} from '../helpers/partner.helper';
import {ResponseSearchPartnerByIdDTO} from '../dtos/response-body-search-partner-by-id.dto';
import { LogDecoratorUtils } from '../utils/log-decorator.utils';
import { LoggerUtils} from '../utils/logger.utils';
import {LogLevelEnum} from '../enums/log-level.enums';
import { Partner } from '../models/partner.model';
import {distance} from '@turf/turf'

export class PartnerService{
  @LogDecoratorUtils.LogAsyncMethod()
  async findPartnerById(id: string): Promise<ResponseSearchPartnerByIdDTO>{
    const partnerRepository: PartnerRepository= new PartnerRepository()
    const partnerHelper: PartnerHelper= new PartnerHelper()
    try {
      const partner= await partnerRepository.findById(id);
      return partnerHelper.generateResponseBodyToRecoveryPartnerByIdSuccessfully(partner)
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, '... @PartnerService/findPartnerById',error);
      return partnerHelper.generateResponseBodyToResquestPartnerByIdFail()
    }
  }

  @LogDecoratorUtils.LogAsyncMethod()
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

  @LogDecoratorUtils.LogAsyncMethod()
  async findPartnerByLocalization(pointDTO: PointDTO): Promise<ResponseSearchPartnerByIdDTO>{
    const partnerRepository: PartnerRepository= new PartnerRepository()
    const partnerHelper: PartnerHelper= new PartnerHelper()
    try {

      const partners= await partnerRepository.findManyIncludingCoord(pointDTO.coordinates);
      const partnerResul= this.getCloserAdress(pointDTO.coordinates,partners);
      return partnerHelper.generateResponseBodyToRecoveryPartnerByIdSuccessfully(partnerResul)
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, '... @PartnerService/findPartnerByLocalization',error);
      return partnerHelper.generateResponseBodyToResquestPartnerByIdFail()
    }
  }


  @LogDecoratorUtils.LogAsyncMethod()
  async insertOnePartner(partnerDTO: PartnertDTO): Promise<ResponseSearchPartnerByIdDTO>{
    const partnerRepository: PartnerRepository= new PartnerRepository()
    const partnerHelper: PartnerHelper= new PartnerHelper()
    try {
      const partnerFound = await partnerRepository.findByIdOrDocument(`${partnerDTO.id}`,partnerDTO.document)
      if(partnerFound && partnerFound.length){
        return partnerHelper.generateResponseBodyToResquestPartnerByIdFail('Partner with id or document alredy Exists!')
      }
      const partnerToInsert= partnerHelper.convertPartnerDtoToPartner(partnerDTO);
      await partnerRepository.insertOne(partnerToInsert);
      return partnerHelper.generateResponseBodyToCreatePartnerSuccessfully(partnerToInsert)
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, '... @PartnerService/findPartnerById',error);
      return partnerHelper.generateResponseBodyToCreatePartnerFail()
    }
  }

  @LogDecoratorUtils.LogAsyncMethod()
  async insertManyPartners(partnersDTO: PartnertDTO[]): Promise<void>{
    LoggerUtils.log(LogLevelEnum.INFO, '... @PartnerService/insertManyPartners/init......');
    for (const partnerDTO of  partnersDTO) {
      await this.insertOnePartner(partnerDTO)
    }
    LoggerUtils.log(LogLevelEnum.INFO, '... @PartnerService/insertManyPartners/finished......');

  }
}
