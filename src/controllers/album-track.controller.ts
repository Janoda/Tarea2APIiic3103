import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Album,
  Track,
} from '../models';
import {AlbumRepository} from '../repositories';

export class AlbumTrackController {
  constructor(
    @repository(AlbumRepository) protected albumRepository: AlbumRepository,
  ) { }

  @get('/albums/{id}/tracks', {
    responses: {
      '200': {
        description: 'Array of Album has many Track',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Track)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Track>,
  ): Promise<Track[]> {
    return this.albumRepository.tracks(id).find(filter);
  }

  @post('/albums/{id}/tracks', {
    responses: {
      '200': {
        description: 'Album model instance',
        content: {'application/json': {schema: getModelSchemaRef(Track)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Album.prototype.ID,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Track, {
            title: 'NewTrackInAlbum',
            exclude: ['ID'],
            optional: ['albumId']
          }),
        },
      },
    }) track: Omit<Track, 'ID'>,
  ): Promise<Track> {
    return this.albumRepository.tracks(id).create(track);
  }

  @patch('/albums/{id}/tracks', {
    responses: {
      '200': {
        description: 'Album.Track PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Track, {partial: true}),
        },
      },
    })
    track: Partial<Track>,
    @param.query.object('where', getWhereSchemaFor(Track)) where?: Where<Track>,
  ): Promise<Count> {
    return this.albumRepository.tracks(id).patch(track, where);
  }

  @del('/albums/{id}/tracks', {
    responses: {
      '200': {
        description: 'Album.Track DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Track)) where?: Where<Track>,
  ): Promise<Count> {
    return this.albumRepository.tracks(id).delete(where);
  }
}
