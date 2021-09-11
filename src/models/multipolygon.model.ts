

import {Column} from 'typeorm';

export class MultiPolygon{
    @Column()
    type!: string;
    @Column()
    coordinates!: Array<Array<Array<Array<number>>>>;
}

