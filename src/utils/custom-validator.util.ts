
import {
  ValidationOptions,
  ValidatorConstraint,
  Validate,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { LoggerUtils } from './logger.utils';
import { LogLevelEnum } from '../enums/log-level.enums';


function verifyLatitudesandLongitudes(array: number[]): boolean{
  if(array.length!==2 ){
    return false
  }
  if((array[0]<(-90))|| (array[0]>(90))){
    return false
  }
  if((array[1]<(-180))|| (array[1]>(80))){
    return false
  }
  return true
}

export function IsValidPoint(validationOptions?: ValidationOptions) {
  return Validate(PointValidator, validationOptions);
}

@ValidatorConstraint({ name: 'IsValidPoint', async: false })
export class PointValidator implements ValidatorConstraintInterface {

  validate(arrayPoints: number[]): boolean {
    return verifyLatitudesandLongitudes(arrayPoints)
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

  validate(arrayOfPolygons: Array<Array<Array<Array<number>>>>): boolean {
    try {
      if(arrayOfPolygons.length<2) {
        throw new Error('Only One Polygon not MultiPolygon')
      }
      for(const polygonDefinitios of arrayOfPolygons){
        if(polygonDefinitios.length<1){
          throw new Error('One Specific Polygon dont have definitions')
        }
        for(const polygonCoordPoints of polygonDefinitios){
          if(polygonCoordPoints.length<3){
            throw new Error('One Specific Polygon dont have enough')
          }
          for(const point of polygonCoordPoints){
            if(!verifyLatitudesandLongitudes(point)) {
              throw new Error('One Specific point of one polygon is not a LatitudesandLongitudes type')
            }
          }
        }
      }
      return true
    } catch (error: any) {
      LoggerUtils.log(LogLevelEnum.ERROR, 'Error validating coord',error);
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
