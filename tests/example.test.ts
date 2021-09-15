import { expect } from 'chai';
import { describe, it,} from 'mocha';
import {PartnerService} from '../src/services/partner.service';
import {RequestValidatorUtils} from '../src/utils/request-validator.utils';
import pdvs from '../files/pdvs.json';
import {RequestCreateManyPartnersDTO} from '../src/dtos/request-body-create-many-partners';
import {RequestCreateOnePartnerDTO} from '../src/dtos/request-body-create-one-partner';
import {RequestBodySearchPartnertDTO} from '../src/dtos/request-body-search-partners-by-adress.dto';
import * as dotenv from 'dotenv';
import {PartnerRepository} from '../src/repositories/partner.repository';
import {Partner} from '../src/models/partner.model';
dotenv.config();
const pointFailTest={
    targetAddress: {
      coordinates: [
        -38.59023,
        -33.75799
      ],
      type: 'Point'
    }
  }
const pointTest={
    targetAddress: {
      coordinates: [
        -38.59023,
        -3.75799
      ],
      type: 'Point'
    }
  }
const pdvTest={
    pdv:
    {
      id: '999',
      tradingName: 'TESTE DEFAULT PDV ',
      ownerName: 'AUTOMATIC TESTE PDV',
      document: '99999.999.410/0001-19',
      coverageArea: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [
                107,
                7
              ],
              [
                108,
                7
              ],
              [
                108,
                8
              ],
              [
                107,
                8
              ],
              [
                107,
                7
              ]
            ]
          ],
          [
            [
              [
                100,
                0
              ],
              [
                101,
                0
              ],
              [
                101,
                1
              ],
              [
                100,
                1
              ],
              [
                100,
                0
              ]
            ]
          ]
        ]
      },
      address: {
        type: 'Point',
        coordinates: [
          -43.97662,
          -19.837042
        ]
      }
    }
}

describe('RequestValidatorUtils', ( )=> {
    const requestValidatorUtils = new RequestValidatorUtils()  
    describe('RequestCreateOnePartnerDTO', () => {
        it('The pdv item must validate without a error',  async (): Promise<void> => {
            try {
                const requestCreateOnePartnerDTO: RequestCreateOnePartnerDTO = requestValidatorUtils.validateDTORequestBody(RequestCreateOnePartnerDTO,pdvTest)   
                if(requestCreateOnePartnerDTO && requestCreateOnePartnerDTO.pdv){
                    expect(requestCreateOnePartnerDTO.pdv.id).to.eq('999');
                }else{
                    expect.fail("Teste validate one item fail.")  
                }      
            } catch (error) {
                expect.fail("Request validate thows exception and failed to validate one pdv item")  
            }            
        });
    });

    describe('RequestCreateManyPartnersDTO - many', () => {
        it('The numbers of pdvs must be equals 51',  async (): Promise<void> => {
            try {
                const requestCreateManyPartnersDTO: RequestCreateManyPartnersDTO = requestValidatorUtils.validateDTORequestBody(RequestCreateManyPartnersDTO,pdvs)
            if(requestCreateManyPartnersDTO && requestCreateManyPartnersDTO.pdvs){
                expect(requestCreateManyPartnersDTO.pdvs.length).to.eq(51);
            }else{
                expect.fail("Teste recovery one item fail in compare.")  
            }
            } catch (error) {
                expect.fail("Request validate thows exception and failed to validate the list of pdvs")  
            }            
        });
    }); 
    
    describe('validateDTORequestBody - one', () => {
        it('The targetAddress must validate without a error',  async (): Promise<void> => {
            try {
                const requestBodySearchPartnertDTO: RequestBodySearchPartnertDTO = requestValidatorUtils.validateDTORequestBody(RequestBodySearchPartnertDTO,pointTest)   
                if(requestBodySearchPartnertDTO && requestBodySearchPartnertDTO.targetAddress){
                    expect(requestBodySearchPartnertDTO.targetAddress.type).to.eq('Point');
                }else{
                    expect.fail("Teste validate one item fail.")  
                }      
            } catch (error) {
                expect.fail("Request validate thows exception and failed to validate targetAdress item")  
            }            
        });
    });

});

describe('PartnerService', ( )=> {
    const partnerService = new PartnerService()  
    const requestValidatorUtils = new RequestValidatorUtils() 

    describe('insertOnePartner', () => {
        it('Should insert and return pdv with id 999',  async (): Promise<void> => {
            try {
                const requestCreateOnePartnerDTO: RequestCreateOnePartnerDTO = requestValidatorUtils.validateDTORequestBody(RequestCreateOnePartnerDTO,pdvTest)   
                if(requestCreateOnePartnerDTO && requestCreateOnePartnerDTO.pdv){
                    const result = await partnerService.insertOnePartner(requestCreateOnePartnerDTO.pdv)
                    if(result && result.pdv && result.pdv.id ){
                        expect(result.pdv.id).to.eq('999');
                    }else{
                        expect.fail("Teste recovery one item fail in compare.")  
                    }
                }else{
                    expect.fail("Teste validate one item fail.")  
                }      
            } catch (error) {
                expect.fail("Request validate thows exception and failed to validate one pdv item")  
            }            
        });
    });

    describe('findPartnerById - ITEM MUST NOT EXISTS', () => {
        it(`Shoud'nt find any` ,  async (): Promise<void> => {
            try {
                const result = await partnerService.findPartnerById('MMM');
                if(result){
                    expect(result.pdv).to.eq(null);
                }else{
                    expect.fail("Teste recovery one item fail in compare.")  
                }
            } catch (error) {
                expect.fail("Teste recovery one item throws exception!")  
            }            
        });
    });    

    describe('findPartnerById - ITEM MUST EXISTS', () => {
        it('Shoud find pdv with id 999',  async (): Promise<void> => {
            try {
                const result = await partnerService.findPartnerById('999');
            if(result && result.pdv && result.pdv.id ){
                expect(result.pdv.id).to.eq('999');
            }else{
                expect.fail("Teste recovery one item fail in compare.")  
            }
            } catch (error) {
                expect.fail("Teste recovery one throws exception!")  
            }            
        });
    }); 

    describe('insertManyPartners', () => {
        it('Should insert and return pdv with id 999',  async (): Promise<void> => {
            try {
                const requestCreateManyPartnersDTO: RequestCreateManyPartnersDTO = requestValidatorUtils.validateDTORequestBody(RequestCreateManyPartnersDTO,pdvs)
            if(requestCreateManyPartnersDTO && requestCreateManyPartnersDTO.pdvs){
                expect(requestCreateManyPartnersDTO.pdvs.length).to.eq(50);
                const result = await partnerService.insertManyPartners(requestCreateManyPartnersDTO.pdvs);
                expect(result).to.eq(true);
            }else{
                expect.fail("Teste recovery one item fail in compare.")  
            }
            } catch (error) {
                expect.fail("Request validate thows exception and failed to validate the list of pdvs")  
            }             
        });
    });

    describe('findPartnerById - Before - insertManyPartners', () => {
        it('Shoud find pdv with id 1',  async (): Promise<void> => {
            try {
                const result = await partnerService.findPartnerById('1');
            if(result && result.pdv && result.pdv.id ){
                expect(result.pdv.id).to.eq('1');
            }else{
                expect.fail("Teste recovery one item fail in compare.")  
            }
            } catch (error) {
                expect.fail("Teste recovery one throws exception!")  
            }            
        });
    }); 

    describe('findPartnerByLocalization - ITEM MUST EXISTS', () => {
        it('Should return the pdv with id =3',  async (): Promise<void> => {
            try {
                const requestBodySearchPartnertDTO: RequestBodySearchPartnertDTO = requestValidatorUtils.validateDTORequestBody(RequestBodySearchPartnertDTO,pointTest)   
                if(requestBodySearchPartnertDTO && requestBodySearchPartnertDTO.targetAddress){
                    const result = await partnerService.findPartnerByLocalization(requestBodySearchPartnertDTO.targetAddress)
                    if(result && result.pdv && result.pdv.id ){
                        expect(result.pdv.id).to.eq('3');
                    }else{
                        expect.fail("Teste recovery closer one item fail in compare.")  
                    }
                }else{
                    expect.fail("Teste validate closer one item fail.")  
                }      
            } catch (error) {
                expect.fail("Request validate thows exception and failed to validate targetAdress item")  
            }            
        });
    });

    describe('findPartnerByLocalization - ITEM MUST NOT EXISTS', () => {
        it('Should return no PDV',  async (): Promise<void> => {
            try {
                const requestBodySearchPartnertDTO: RequestBodySearchPartnertDTO = requestValidatorUtils.validateDTORequestBody(RequestBodySearchPartnertDTO,pointFailTest)   
                if(requestBodySearchPartnertDTO && requestBodySearchPartnertDTO.targetAddress){
                    const result = await partnerService.findPartnerByLocalization(requestBodySearchPartnertDTO.targetAddress)
                    if(result){
                        expect(result.pdv).to.eq(null);
                    }else{
                        expect.fail("Teste recovery closer one item fail in compare.")  
                    }
                }else{
                    expect.fail("Teste validate closer one item fail.")  
                }      
            } catch (error) {
                expect.fail("Request validate thows exception and failed to validate targetAdress item")  
            }            
        });
    });

       
});

describe('PartnerRepository', ( )=> {
    const partnerRepository = new PartnerRepository()  
    describe('createIndex', () => {
        it('Create index on partner',  async (): Promise<void> => {
            try {
                const result = await partnerRepository.createIndex()  
                expect(result).to.eq(true);  
            } catch (error) {
                expect.fail("Request validate thows exception and failed to validate one pdv item")  
            }            
        });
    });
    
    describe('findMany', () => {
        it('Find many',  async (): Promise<void> => {
            try {
                const result:Partner[] = await partnerRepository.findMany()  
                expect((result.length>0)).to.eq(true);  
            } catch (error) {
                expect.fail("Request validate thows exception and failed to validate one pdv item")  
            }            
        });
    });  

    describe('findByIdOrDocument', () => {
        it('Find element by id or document - ITEM MUST EXISTS ',  async (): Promise<void> => {
            try {
                const result:Partner[] = await partnerRepository.findByIdOrDocument(pdvTest.pdv.id,pdvTest.pdv.document)  
                expect(result.length).to.eq(1);  
            } catch (error) {
                expect.fail("Request validate thows exception and failed to validate one pdv item")  
            }            
        });
    });

    describe('findByIdOrDocument', () => {
        it('Find element by id or document - ITEM MUST NOT EXISTS ',  async (): Promise<void> => {
            try {
                const result:Partner[] = await partnerRepository.findByIdOrDocument('MMM','MMM')  
                expect(result.length).to.eq(0);  
            } catch (error) {
                expect.fail("Request validate thows exception and failed to validate one pdv item")  
            }            
        });
    });

});
