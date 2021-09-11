import { MongoRepository } from 'typeorm';
import {getconnectionMongo} from '../conf/mongo.configurations';
import {Partner} from '../models/partner.model';
import {Service} from 'typedi';

@Service()
export class PartnerRepository{

  async insertOne(partner: Partner): Promise<Partner>{
    const conn = await getconnectionMongo();
    const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
    const result = await repository.save(partner);
    return result
  }

  async insertMany(partners: Partner[]): Promise<Partner[]>{
    const conn = await getconnectionMongo();
    const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
    const result = await repository.save(partners);
    return result
  }

  async findById(id: string): Promise<Partner>{
    const conn = await getconnectionMongo();
    const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
    const result = await repository.findOneOrFail(id)
    return result
  }
  async findMany(query={}): Promise<Partner[]>{
    const conn = await getconnectionMongo();
    const repository: MongoRepository<Partner> = conn.getMongoRepository(Partner);
    const result = await repository.find(query)
    return result
  }

}
