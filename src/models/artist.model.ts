import {Entity, hasMany, model, property} from '@loopback/repository';
import {Album} from './album.model';
import {Track} from './track.model';

@model()
export class Artist extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  ID: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  age: number;
  // @property({
  //   type: 'string',
  // })
  // tracks?: string;


  @hasMany(() => Album)
  albums: Album[];

  @hasMany(() => Track)
  tracks: Track[];

  constructor(data?: Partial<Artist>) {
    super(data);
  }
}

export interface ArtistRelations {
  // describe navigational properties here
}

export type ArtistWithRelations = Artist & ArtistRelations;
