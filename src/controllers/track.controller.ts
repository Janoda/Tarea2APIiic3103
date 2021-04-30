import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Track} from '../models';
import {TrackRepository} from '../repositories';

export class TrackController {
  constructor(
    @repository(TrackRepository)
    public trackRepository : TrackRepository,
  ) {}

  @post('/tracks')
  @response(200, {
    description: 'Track model instance',
    content: {'application/json': {schema: getModelSchemaRef(Track)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Track, {
            title: 'NewTrack',
            exclude: ['ID'],
          }),
        },
      },
    })
    track: Omit<Track, 'ID'>,
  ): Promise<Track> {
    return this.trackRepository.create(track);
  }

  @get('/tracks/count')
  @response(200, {
    description: 'Track model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Track) where?: Where<Track>,
  ): Promise<Count> {
    return this.trackRepository.count(where);
  }

  @get('/tracks')
  @response(200, {
    description: 'Array of Track model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Track, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Track) filter?: Filter<Track>,
  ): Promise<Track[]> {
    return this.trackRepository.find(filter);
  }

  @patch('/tracks')
  @response(200, {
    description: 'Track PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Track, {partial: true}),
        },
      },
    })
    track: Track,
    @param.where(Track) where?: Where<Track>,
  ): Promise<Count> {
    return this.trackRepository.updateAll(track, where);
  }

  @get('/tracks/{id}')
  @response(200, {
    description: 'Track model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Track, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Track, {exclude: 'where'}) filter?: FilterExcludingWhere<Track>
  ): Promise<Track> {
    return this.trackRepository.findById(id, filter);
  }

  @patch('/tracks/{id}')
  @response(204, {
    description: 'Track PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Track, {partial: true}),
        },
      },
    })
    track: Track,
  ): Promise<void> {
    await this.trackRepository.updateById(id, track);
  }

  @put('/tracks/{id}')
  @response(204, {
    description: 'Track PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() track: Track,
  ): Promise<void> {
    await this.trackRepository.replaceById(id, track);
  }

  @del('/tracks/{id}')
  @response(204, {
    description: 'Track DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.trackRepository.deleteById(id);
  }
}
