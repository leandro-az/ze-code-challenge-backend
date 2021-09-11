import {
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import {PartnertDTO} from './partner.dto';

export class RequestCreateManyPartnersDTO {

        @ValidateNested({ each: true })
        @Type(()=>PartnertDTO)
        pdvs!: PartnertDTO[]

}
