
import {
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import {PointDTO} from './point.dto';

export class RequestBodySearchPartnertDTO {

      @ValidateNested()
      @Type(()=>PointDTO)
      targetAddress!: PointDTO

}


