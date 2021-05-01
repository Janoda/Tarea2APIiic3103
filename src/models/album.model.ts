import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Artist} from './artist.model';
import {Track} from './track.model';

@model()
export class Album extends Entity {
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
    type: 'string',
    required: true,
  })
  genre: string;


  @hasMany(() => Track)
  tracks: Track[];

  @belongsTo(() => Artist)
  artistId: string;

  constructor(data?: Partial<Album>) {
    super(data);
  }
}

export interface AlbumRelations {
  // describe navigational properties here
}

export type AlbumWithRelations = Album & AlbumRelations;
