
import {Column} from 'typeorm';

export class Point {

      @Column()
      type!: string;

      @Column()
      coordinates!: Array<number>;


}


