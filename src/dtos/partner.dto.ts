
import {
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import {MultiPolygonDTO} from './multipolygon.dto';
import {PointDTO} from './point.dto';

export class PartnertDTO {

    @IsOptional()
    id?: string|number;

    @IsString()
    tradingName!: string;

    @IsString()
    ownerName!: string;

    @IsString()
    document!: string;

    @ValidateNested()
    @Type(() => MultiPolygonDTO)
    coverageArea!: MultiPolygonDTO;

    @ValidateNested()
    @Type(()=>PointDTO)
    address!: PointDTO


}


