
import {Entity, ObjectIdColumn, Column} from 'typeorm';
import {Point} from './point.model';
import {MultiPolygon} from './multipolygon.model'

@Entity()
export class Partner {

    @ObjectIdColumn()
    id!: string;

    @Column()
    tradingNameStr!: string;

    @Column()
    ownerNameStr!: string;

    @Column()
    documentStr!: string;

    @Column(()=>MultiPolygon)
    coverageAreaMultiPol!: MultiPolygon;

    @Column(()=>Point)
    addressPoint!: Point


}


