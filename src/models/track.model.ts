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
  })
  duration: number;

  @property({
    type: 'number',
    default: 0,
  })
  timesPlayed?: number;

  @property({
    type: 'string',
  })
  artist?: string;

  @property({
    type: 'string',
  })
  album?: string;



  @belongsTo(() => Album)
  albumId: string;

  @belongsTo(() => Album)
  artistID: string;

  constructor(data?: Partial<Track>) {
    super(data);
  }
}

export interface TrackRelations {
  // describe navigational properties here
}

export type TrackWithRelations = Track & TrackRelations;
