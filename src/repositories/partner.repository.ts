import { MongoRepository } from 'typeorm';
import {getconnectionMongo} from '../conf/mongo.configurations';
import {Partner} from '../models/partner.model';
import { LogDecoratorUtils } from '../utils/log-decorator.utils';

export class PartnerRepository{


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
  async findById(id: string): Promise<Partner>{
    const conn = await getconnectionMongo();
    const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
    const result = await repository.findOneOrFail({idExternalStr:id})
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
        $or: [ { idStr: idElement }, { documentStr: document } ]
      }
    };
    const conn = await getconnectionMongo();
    const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
    const result = await repository.find(query);
    return result
  }

}
