
import {
  IsString,
  Equals,
  IsArray
} from 'class-validator';
import {IsValidPoint} from '../utils/custom-validator.util';

export class PointDTO {

      @IsString()
      @Equals('Point')
      type!: string;

      @IsArray()
      @IsValidPoint()
      coordinates!: number[];


}


