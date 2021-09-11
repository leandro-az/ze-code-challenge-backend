
import {PartnerRepository} from '../repositories/partner.repository';
import {Service} from 'typedi';
import {PartnertDTO} from '../dtos/partner.dto';
import {PartnerHelper} from '../helpers/partner.helper';
import {ResponseSearchPartnerByIdDTO} from '../dtos/response-body-search-partner-by-id.dto';
import { LogDecoratorUtils } from '../utils/log-decorator.utils';
import { LoggerUtils} from '../utils/logger.utils';
import {LogLevelEnum} from '../enums/log-level.enums';
import { v1 as uuidv1 } from 'uuid';

@Service()
export class PartnerService{
  constructor(
        private readonly partnerRepository: PartnerRepository,
        private readonly partnerHelper: PartnerHelper
  ) {
  }
  @LogDecoratorUtils.LogAsyncMethod()
  async findPartnerById(id: string): Promise<ResponseSearchPartnerByIdDTO>{
    try {
      const partner= await this.partnerRepository.findById(id);
      return this.partnerHelper.generateResponseBodyToRecoveryPartnerByIdSuccessfully(partner)
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, '... @PartnerService/findPartnerById',error);
      return this.partnerHelper.generateResponseBodyToResquestPartnerByIdFail()
    }
  }


  @LogDecoratorUtils.LogAsyncMethod()
  async insertOnePartner(partnerDTO: PartnertDTO): Promise<ResponseSearchPartnerByIdDTO>{
    try {
      const partnerFound = await this.partnerRepository.findMany({$or: [ { id: partnerDTO.id }, { documentStr: partnerDTO.document } ] })
      if(partnerFound && partnerFound.length){
        return this.partnerHelper.generateResponseBodyToResquestPartnerByIdFail('Partner with id or document alredy Exists!')
      }
      const partnerToInsert= this.partnerHelper.convertPartnerDtoToPartner(partnerDTO);
      partnerToInsert.id=partnerToInsert.id?partnerToInsert.id:uuidv1();
      await this.partnerRepository.insertOne(partnerToInsert);
      return this.partnerHelper.generateResponseBodyToRecoveryPartnerByIdSuccessfully(partnerToInsert)
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, '... @PartnerService/findPartnerById',error);
      return this.partnerHelper.generateResponseBodyToResquestPartnerByIdFail()
    }
  }
}
