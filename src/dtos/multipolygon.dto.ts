

import {
  IsString,
  Equals,
  IsArray
} from 'class-validator';
import {IsValidMultiPolygon} from '../utils/custom-validator.util';

export class MultiPolygonDTO{
    @IsString()
    @Equals('MultiPolygon')
    type!: string;
    @IsArray()
    @IsValidMultiPolygon()
    coordinates!: Array<Array<Array<Array<number>>>>;
}

