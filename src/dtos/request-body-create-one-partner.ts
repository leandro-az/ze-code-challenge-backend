import {
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import {PartnertDTO} from './partner.dto';

export class RequestCreateOnePartnerDTO {

        @ValidateNested({ each: true })
        @Type(()=>PartnertDTO)
        pdv!: PartnertDTO

}
