import {inject} from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,


  patch, post,




  put,




  Request, requestBody,
  response,


  Response, RestBindings
} from '@loopback/rest';
import {Track} from '../models';
import {TrackRepository} from '../repositories';

// eslint-disable-next-line @typescript-eslint/naming-convention
type Trackreturn = {id: string, album_id: string, name: string, duration: number, times_played: number, artist: string, album: string, self: string};

export class TrackController {
  constructor(
    @repository(TrackRepository)
    public trackRepository: TrackRepository,
    @inject(RestBindings.Http.RESPONSE) public res: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) { }

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
  ): Promise<Trackreturn[]> {
    const ra: Trackreturn[] = [];

    (await this.trackRepository.find(filter)).forEach((el) => {
      const a = {} as Trackreturn
      a.id = el.ID
      a.album_id = el.albumId
      a.name = el.name
      a.duration = el.duration
      a.times_played = el.timesPlayed
      a.artist = this.request.get('host') + "/artists/" + el.artistId
      a.album = this.request.get('host') + "/albums/" + el.albumId
      a.self = this.request.get('host') + "/albums/" + el.ID
      ra.push(a);

    });
    return ra;

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
  ): Promise<Trackreturn> {
    const a = {} as Trackreturn
    const el = await this.trackRepository.findById(id, filter);
    if (!el) {
      this.res.status(404)
      return {} as Trackreturn
    }
    a.id = el.ID
    a.album_id = el.albumId
    a.name = el.name
    a.duration = el.duration
    a.times_played = el.timesPlayed
    a.artist = this.request.get('host') + "/artists/" + el.artistId
    a.album = this.request.get('host') + "/albums/" + el.albumId
    a.self = this.request.get('host') + "/albums/" + el.ID

    return a
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

  @put('/tracks/{id}/play')
  @response(204, {
    description: 'Track PUT success',
  })
  async playSong(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter2?: Filter<Track>,
  ): Promise<void> {
    const track = await this.trackRepository.findById(id)
    track.timesPlayed++
    await this.trackRepository.replaceById(id, track);
  }
}
