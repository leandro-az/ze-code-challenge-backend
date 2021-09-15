import 'reflect-metadata';
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
import {PartnerHelper} from '../src/helpers/partner.helper';
import {PointDTO} from '../src/dtos/point.dto';
dotenv.config();
const pointFailCustomTest={
    targetAddress: {
      coordinates: [
        180,
        180,
        180
      ],
      type: 'Point'
    }
  }
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
const pdvTest:RequestCreateOnePartnerDTO={
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

const pdvTestRepository:RequestCreateOnePartnerDTO={
    pdv:
    {
      id: '888',
      tradingName: 'TESTE DEFAULT PDV  REPOSITORY',
      ownerName: 'AUTOMATIC TESTE PDV REPOSITORY',
      document: '88888.888.410/0001-18',
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

    describe('RequestCreateOnePartnerDTO - FORCE ERROR', () => {
        it('The pdv item must validate a error',  async (): Promise<void> => {
            try {
                requestValidatorUtils.validateDTORequestBody(PointDTO,pointFailCustomTest)   
                expect.fail("Test validate mus thow errros.")    
            } catch (error) {
                expect(1).to.eq(1) 
            }            
        });
    });

});

describe('PartnerHelper', ( )=> {
    const partnerHelper = new PartnerHelper()  
    describe('RequestCreateOnePartnerDTO', () => {
        it('Build response - Try insert Duplicated value', () => {
                       const duplicatedValue = partnerHelper.generateResponseBodyToResquestPartnerDuplicatedFail();
                       expect(duplicatedValue.statusCode).to.eq(409)
        });
        it('Build response - Insert fail', () => {
            const inserrt = partnerHelper.generateResponseBodyToCreatePartnerFail();
            expect(inserrt.statusCode).to.eq(409)
        });

        it('Build response - Insert Successfully', () => {
            const inserrt = partnerHelper.generateResponseBodyToRecoveryPartnersSuccessfully([]);
            expect(inserrt.statusCode).to.eq(202)
        });

        it('Build response - Recovery Partners Fail', () => {
            const duplicatedValue = partnerHelper.generateResponseBodyToRecoveryPartnersFail([]);
            expect(duplicatedValue.statusCode).to.eq(404)
        });

        it('Build response - Recovery Partners Fail', () => {
            const duplicatedValue = partnerHelper.generateResponseBodyToCreatePartners([],[]);
            expect(duplicatedValue.statusCode).to.eq(202)
        });

        
    });

});


describe('PartnerRepository', ( )=> {
    const partnerRepository = new PartnerRepository();
    const partnerHelper: PartnerHelper= new PartnerHelper()
    describe('insertOne', () => {
        it('Shoud insert one partner',  async (): Promise<void> => {
            try {
                const partnerToInsert= partnerHelper.convertPartnerDtoToPartner(pdvTestRepository.pdv);
                const result = await  partnerRepository.insertOne(partnerToInsert) 
                expect(`${result.idExternalStr}`).to.eq(`${pdvTestRepository.pdv.id}`)   
            } catch (error) {
                expect.fail("Insert one pdv fail")  
            }             
        });
    }); 

    describe('createIndex', () => {
        it('Create index on partner',  async (): Promise<void> => {
            try {
                const result = await partnerRepository.createIndex()  
                expect(result).to.eq(true);  
            } catch (error) {
                expect.fail("Create Index fail")  
            }            
        });
    });
    
    describe('findMany', () => {
        it('Find many',  async (): Promise<void> => {
            try {
                const result:Partner[] = await partnerRepository.findMany()  
                expect((result.length>0)).to.eq(true);  
            } catch (error) {
                expect.fail("Find Many fail")  
            }            
        });
    });  

    describe('findByIdOrDocument', () => {
        it('Find element by id or document - ITEM MUST EXISTS ',  async (): Promise<void> => {
            try {
                const result:Partner[] = await partnerRepository.findByIdOrDocument(`${pdvTestRepository.pdv.id}`,pdvTestRepository.pdv.document)  
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

    describe('Delete Many', () => {
        it('Delete  many',  async (): Promise<void> => {
            try {
                const result:boolean = await partnerRepository.deleteMany()  
                expect(result).to.eq(true);  
            } catch (error) {
                expect.fail("Delete many fail")  
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
                expect.fail("Insert one partner fail")  
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
                expect.fail("Teste recovery partner one item fail in compare.")  
            }
            } catch (error) {
                expect.fail("Teste recovery partner one throws exception!")  
            }            
        });
    }); 

    describe('insertManyPartners', () => {
        it('Should insert a pdv list',  async (): Promise<void> => {
            try {
                const requestCreateManyPartnersDTO: RequestCreateManyPartnersDTO = requestValidatorUtils.validateDTORequestBody(RequestCreateManyPartnersDTO,pdvs)
            if(requestCreateManyPartnersDTO && requestCreateManyPartnersDTO.pdvs){
                // expect(requestCreateManyPartnersDTO.pdvs.length).to.eq(51);
                const result = await partnerService.insertManyPartners(requestCreateManyPartnersDTO.pdvs);
                expect(result).to.eq(true);
            }else{
                expect.fail("Teste recovery one item fail in compare.")  
            }
            } catch (error) {
                expect.fail("Insert pdv list thowrs excpetion")  
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
                expect.fail("Teste recovery partner by id fail in compare.")  
            }
            } catch (error) {
                expect.fail("Teste recovery partner by id  throws exception!")  
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
                        expect.fail("Teste recovery closer  item fail in compare.")  
                    }
                }else{
                    expect.fail("Teste validate closer  item fail.")  
                }      
            } catch (error) {
                expect.fail("Teste recovery closer thows exception and failed to validate targetAdress item")  
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
                        expect.fail("Teste not recovery closer one item fail in compare.")  
                    }
                }else{
                    expect.fail("Teste validate not closer one item fail.")  
                }      
            } catch (error) {
                expect.fail("Test not recovery closer thows exception and failed to validate targetAdress item")  
            }            
        });
    });

       
});


