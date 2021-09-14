
import {
  IsString,
  Equals,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize
} from 'class-validator';
import {IsValidPoint} from '../utils/custom-validator.util';

export class PointDTO {

      @IsString()
      @Equals('Point')
      type!: string;

      @IsArray()
      @ArrayMinSize(2)
      @ArrayMaxSize(2)
      @IsValidPoint()
      coordinates!: number[];


}


