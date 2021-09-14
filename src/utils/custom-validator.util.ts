
import {
  ValidationOptions,
  ValidatorConstraint,
  Validate,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { LoggerUtils } from './logger.utils';
import { LogLevelEnum } from '../enums/log-level.enums';
import {geojsonType} from '@turf/turf'
// import {} from 'geojson-validation'


// function verifyLatitudesAndLongitudes(array: number[]): boolean{
//   if(array.length!==2 ){
//     return false
//   }
//   if((array[0]<(-90))|| (array[0]>(90))){
//     return false
//   }
//   if((array[1]<(-180))|| (array[1]>(180))){
//     return false
//   }
//   return true
// }

export function IsValidPoint(validationOptions?: ValidationOptions) {
  return Validate(PointValidator, validationOptions);
}

@ValidatorConstraint({ name: 'IsValidPoint', async: false })
export class PointValidator implements ValidatorConstraintInterface {

  validate(arrayPoints: number[]): boolean {
    try {
      const obj={
        type: 'Point',
        coordinates: arrayPoints
      }
      geojsonType(obj,'Point','IsValidPoint')
      // point(arrayPoints);
      return true
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, 'Error validating point',error);
      return false
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} point must be in format => [-90<=+x<=90, -180<=y<=80]`;
  }

}


export function IsValidMultiPolygon(validationOptions?: ValidationOptions) {
  return Validate(MultiPolygonValidator, validationOptions);
}

@ValidatorConstraint({ name: 'IsValidMultiPolygon', async: false })
export class MultiPolygonValidator implements ValidatorConstraintInterface {

  validate(arrayOfPolygons: number[][][][]): boolean {
    try {
      const obj={
        type: 'MultiPolygon',
        coordinates: arrayOfPolygons
      }
      geojsonType(obj,'MultiPolygon','IsValidMultiPolygon')
      return true
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, 'Error validating MultiPolygon',error);
      return false
    }

  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} 
       MultiPolygon must have: 
        1- More than one polygon,
        2- Some definition,
        3- More than or equels 3 coordenates
        4- The Coordenate must be in format => [-90<=+x<=90, -180<=y<=80]`;
  }

}
