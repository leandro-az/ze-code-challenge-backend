import { MongoRepository } from 'typeorm';
import {getconnectionMongo} from '../conf/mongo.configurations';
import {Partner} from '../models/partner.model';
import { LogDecoratorUtils } from '../utils/log-decorator.utils';

/**
   * @description  Class Accesses Database an collection
   */

export class PartnerRepository{
  constructor(){
    // this.createIndex()
  }

  /**
   * @description  Create index to help in find
   * Note: I would create a index 2dsphere to coverageAreaMultiPol but some pdvs coverege ares
   * that interpolating each oder generating that creates an anomaly in the polygon shap
   */
  async createIndex(): Promise<boolean>{
    try {
      const conn = await getconnectionMongo();
      const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
      await repository.createCollectionIndex({documentStr:1},{unique: true})
      await repository.createCollectionIndex({idExternalStr:1},{unique: true})
      return true
    } catch (error) {
      return false
    }

    // await repository.createCollectionIndex({addressPoint:'2dsphere'})
    // await repository.createCollectionIndex({coverageAreaMultiPol:'2dsphere'})
  }

  @LogDecoratorUtils.LogAsyncMethod()
  async insertOne(partner: Partner): Promise<Partner>{
    const conn = await getconnectionMongo();
    const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
    const result = await repository.save(partner);
    return result
  }

  @LogDecoratorUtils.LogAsyncMethod()
  async insertMany(partners: Partner[]): Promise<Partner[]>{
    const conn = await getconnectionMongo();
    const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
    const result = await repository.save(partners);
    return result
  }

  @LogDecoratorUtils.LogAsyncMethod()
  async findByIdExternal(id: string): Promise<Partner|undefined>{
    const conn = await getconnectionMongo();
    const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
    const query={
      where:{idExternalStr: id}
    }
    const result = await repository.findOne(query)
    return result
  }
  @LogDecoratorUtils.LogAsyncMethod()
  async findMany(query={}): Promise<Partner[]>{
    const conn = await getconnectionMongo();
    const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
    const result = await repository.find(query)
    return result
  }
  @LogDecoratorUtils.LogAsyncMethod()
  async findManyGeoIntersec(coord: number[]): Promise<Partner[]>{
    const conn = await getconnectionMongo();
    const query={
      where:{
        coverageAreaMultiPol: { $geoIntersects: { $geometry: { type: 'Point', coordinates:  coord } } }
      }
    }
    const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
    const result = await repository.find(query)
    return result
  }
  @LogDecoratorUtils.LogAsyncMethod()
  async findByIdOrDocument(idElement: string|undefined,document: string): Promise<Partner[]>{
    const query={
      where:{
        $or: [ { idExternalStr: idElement }, { documentStr: document } ]
      }
    };
    const conn = await getconnectionMongo();
    const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
    const result = await repository.find(query);
    return result
  }

  @LogDecoratorUtils.LogAsyncMethod()
  async deleteMany(query={}): Promise<boolean>{
    const conn = await getconnectionMongo();
    const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
    const result = await repository.delete(query);
    const bool: boolean= (result &&  result.affected&& result.affected>0) ?true:false
    return bool
  }

}
