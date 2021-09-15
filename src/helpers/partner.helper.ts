import {Partner} from '../models/partner.model';
import {PartnertDTO} from '../dtos/partner.dto';
import {ResponseSearchPartnerByIdDTO} from '../dtos/response-body-search-partner-by-id.dto';
import {ResponseSearchPartnersByAdressDTO} from '../dtos/response-body-search-partners-by-adress.dto';
import {ResponseCreateManyPartnersDTO} from '../dtos/response-body-create-many-partners.dto'
import { LogDecoratorUtils } from '../utils/log-decorator.utils';
import {HttpStatusEnum} from '../enums/http-status.enum';
import { v1 as uuidv1 } from 'uuid';

export class PartnerHelper{

    @LogDecoratorUtils.LogMethod()
  convertPartnerDtoToPartner(partnerDTO: PartnertDTO): Partner{
    return {
      addressPoint:partnerDTO.address,
      coverageAreaMultiPol: partnerDTO.coverageArea,
      documentStr: partnerDTO.document,
      idExternalStr: partnerDTO.id? `${partnerDTO.id}`:uuidv1(),
      ownerNameStr: partnerDTO.ownerName,
      tradingNameStr: partnerDTO.tradingName
    }
  }
    @LogDecoratorUtils.LogMethod()
    convertPartnerToPartnerDTO(partner: Partner): PartnertDTO{
      return {
        address:partner.addressPoint,
        coverageArea:partner.coverageAreaMultiPol,
        document:partner.documentStr,
        id: partner.idExternalStr,
        ownerName: partner.ownerNameStr,
        tradingName: partner.tradingNameStr
      }
    }
    @LogDecoratorUtils.LogMethod()
    generateResponseBodyToRecoveryPartnerByIdSuccessfully(partner: Partner): ResponseSearchPartnerByIdDTO{
      return {
        message: 'Partner Recovered Successfully!',
        pdv: this.convertPartnerToPartnerDTO(partner),
        statusCode:HttpStatusEnum.ACCEPTED
      }
    }

    @LogDecoratorUtils.LogMethod()
    generateResponseBodyToResquestPartnerByIdFail(msg='Partner not found!'): ResponseSearchPartnerByIdDTO{
      return {
        message: msg,
        pdv: null,
        statusCode:HttpStatusEnum.NOT_FOUND
      }
    }

    @LogDecoratorUtils.LogMethod()
    generateResponseBodyToResquestPartnerDuplicatedFail(msg='Partner with id or document already Exists!'): ResponseSearchPartnerByIdDTO{
      return {
        message: msg,
        pdv: null,
        statusCode:HttpStatusEnum.CONFLICT
      }
    }

    @LogDecoratorUtils.LogMethod()
    generateResponseBodyToCreatePartnerSuccessfully(partner: Partner): ResponseSearchPartnerByIdDTO{
      return {
        message: 'Partner Created Successfully!',
        pdv: this.convertPartnerToPartnerDTO(partner),
        statusCode:HttpStatusEnum.CREATED
      }
    }

    @LogDecoratorUtils.LogMethod()
    generateResponseBodyToCreatePartnerFail(msg='Partner Created Fail!'): ResponseSearchPartnerByIdDTO{
      return {
        message: msg,
        pdv: null,
        statusCode:HttpStatusEnum.CONFLICT
      }
    }

    @LogDecoratorUtils.LogMethod()
    generateResponseBodyToRecoveryPartnersSuccessfully(partners: Partner[]): ResponseSearchPartnersByAdressDTO{
      const listPartnertDTO: PartnertDTO[]=[];
      for(const partner of partners){
        listPartnertDTO.push(this.convertPartnerToPartnerDTO(partner))
      }
      return {
        message: 'List of Partners  Recovered Successfully!',
        pdvs: listPartnertDTO,
        totalRecords: listPartnertDTO.length,
        statusCode:HttpStatusEnum.ACCEPTED
      }
    }

    @LogDecoratorUtils.LogMethod()
    generateResponseBodyToRecoveryPartnersFail(partners: Partner[],msg='Fail Recovering List of Partners'): ResponseSearchPartnersByAdressDTO{
      const listPartnertDTO: PartnertDTO[]=[];
      for(const partner of partners){
        listPartnertDTO.push(this.convertPartnerToPartnerDTO(partner))
      }
      return {
        message: msg,
        pdvs: [],
        totalRecords:0,
        statusCode:HttpStatusEnum.NOT_FOUND
      }
    }

    @LogDecoratorUtils.LogMethod()
    generateResponseBodyToCreatePartners(partnersSuc: Partner[],partnersFail: Partner[]): ResponseCreateManyPartnersDTO{
      const listPartnertSucDTO: PartnertDTO[]=[];
      const listPartnertFailDTO: PartnertDTO[]=[];
      for(const partner of partnersSuc){
        listPartnertSucDTO.push(this.convertPartnerToPartnerDTO(partner))
      }
      for(const partner of partnersFail){
        listPartnertFailDTO.push(this.convertPartnerToPartnerDTO(partner))
      }
      return {
        message: 'List of Partners  created Successfully!',
        pdvsSuccess: listPartnertSucDTO,
        totalRecordsSuccess: listPartnertSucDTO.length,
        pdvsErros:listPartnertFailDTO,
        totalRecordsErros:listPartnertFailDTO.length,
        statusCode:HttpStatusEnum.ACCEPTED
      }
    }

}
