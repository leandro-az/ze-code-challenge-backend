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


  async createIndex(){
    const conn = await getconnectionMongo();
    const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
    await repository.createCollectionIndex({documentStr:1},{unique: true})
    await repository.createCollectionIndex({idExternalStr:1},{unique: true})
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
  async findByIdExternal(id: string): Promise<Partner>{
    const conn = await getconnectionMongo();
    const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
    const result = await repository.findOneOrFail({idExternalStr: id})
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
  async findManyIncludingCoord(coord: number[]): Promise<Partner[]>{
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

}
