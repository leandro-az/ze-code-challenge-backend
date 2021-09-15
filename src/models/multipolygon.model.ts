

import {Column} from 'typeorm';

export class MultiPolygon{
    @Column()
    type!: string;
    @Column()
    coordinates!: number[][][][];
}

