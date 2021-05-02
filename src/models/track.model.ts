import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Album} from './album.model';

@model()
export class Track extends Entity {
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
    postgresql: {
      dataType: 'float',
    },
  })
  duration: number;

  @property({
    type: 'number',
    default: 0,
  })
  timesPlayed: number;



  @belongsTo(() => Album)
  albumId: string;

  @belongsTo(() => Album)
  artistId: string;

  constructor(data?: Partial<Track>) {
    super(data);
  }
}

export interface TrackRelations {
  // describe navigational properties here
}

export type TrackWithRelations = Track & TrackRelations;
