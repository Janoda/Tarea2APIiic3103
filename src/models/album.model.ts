import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Track} from './track.model';
import {Artist} from './artist.model';

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

  @property({
    type: 'string',
  })
  artist?: string;
  @property({
    type: 'string',
  })
  self?: string;
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
