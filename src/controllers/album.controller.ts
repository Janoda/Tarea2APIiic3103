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
  getModelSchemaRef, getWhereSchemaFor, param,


  patch, post,




  put,




  Request, requestBody,
  response,


  Response, RestBindings
} from '@loopback/rest';
import {Album, Track} from '../models';
import {AlbumRepository, TrackRepository} from '../repositories';

// eslint-disable-next-line @typescript-eslint/naming-convention
type Albumreturn = {id: string, artist_id: string, name: string, genre: string, artist: string, tracks: string, self: string};


export class AlbumController {
  constructor(
    @repository(AlbumRepository)
    public albumRepository: AlbumRepository,
    @repository(TrackRepository)
    public trackRepository: TrackRepository,
    @inject(RestBindings.Http.RESPONSE) public res: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) { }

  @post('/albums')
  @response(200, {
    description: 'Album model instance',
    content: {'application/json': {schema: getModelSchemaRef(Album)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Album, {
            title: 'NewAlbum',
            exclude: ['ID'],
          }),
        },
      },
    })
    album: Omit<Album, 'ID'>,
  ): Promise<Album> {
    return this.albumRepository.create(album);
  }

  @get('/albums/count')
  @response(200, {
    description: 'Album model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Album) where?: Where<Album>,
  ): Promise<Count> {
    return this.albumRepository.count(where);
  }

  @get('/albums')
  @response(200, {
    description: 'Array of Album model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Album, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Album) filter?: Filter<Album>,
  ): Promise<Albumreturn[]> {
    const ra: Albumreturn[] = [];

    (await this.albumRepository.find(filter)).forEach((el) => {
      const a = {} as Albumreturn;
      a.id = el.ID
      a.artist_id = el.artistId
      a.name = el.name
      a.genre = el.genre
      a.artist = this.request.get('host') + "/artists/" + el.artistId
      a.tracks = this.request.get('host') + "/albums/" + el.ID + "/tracks"
      a.self = this.request.get('host') + "/albums/" + el.ID
      ra.push(a);

    });
    return ra;

  }

  @patch('/albums')
  @response(200, {
    description: 'Album PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Album, {partial: true}),
        },
      },
    })
    album: Album,
    @param.where(Album) where?: Where<Album>,
  ): Promise<Count> {
    return this.albumRepository.updateAll(album, where);
  }

  @get('/albums/{id}')
  @response(200, {
    description: 'Album model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Album, {includeRelations: true}),
      },
    },
  })
  @response(404, {
    description: 'No encontrado album',
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Album, {exclude: 'where'}) filter?: FilterExcludingWhere<Album>
  ): Promise<Albumreturn> {
    const a = {} as Albumreturn;
    const el = await this.albumRepository.findById(id, filter);
    if (!el) {
      this.res.status(404)
      return {} as Albumreturn
    }
    a.id = el.ID
    a.artist_id = el.artistId
    a.name = el.name
    a.genre = el.genre
    a.artist = this.request.get('host') + "/artists/" + el.artistId
    a.tracks = this.request.get('host') + "/albums/" + el.ID + "/tracks"
    a.self = this.request.get('host') + "/albums/" + el.ID

    return a
  }

  @patch('/albums/{id}')
  @response(204, {
    description: 'Album PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Album, {partial: true}),
        },
      },
    })
    album: Album,
  ): Promise<void> {
    await this.albumRepository.updateById(id, album);
  }

  @put('/albums/{id}')
  @response(204, {
    description: 'Album PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() album: Album,
  ): Promise<void> {
    await this.albumRepository.replaceById(id, album);
  }

  @del('/albums/{id}')
  @response(204, {
    description: 'Album DELETE success',
  })
  async deleteById(@param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Track)) where?: Where<Track>,
  ): Promise<void> {
    await this.albumRepository.deleteById(id);
    await this.albumRepository.tracks(id).delete(where);
  }


  @put('/albums/{id}/tracks/play')
  @response(200, {
    description: 'Artist model instance',

  })
  @response(404, {
    description: 'No encontrado',

  })
  async playSongs(
    @param.path.string('id') id: string,
    //@param.filter(Artist, {exclude: 'where'}) filter?: FilterExcludingWhere<Artist>,
    @param.query.object('filter') filter2?: Filter<Track>,
  ): Promise<void> {
    // const a = await this.artistRepository.findById(id, filter)
    // if (!a) {
    //   this.res.status(404)
    //   return
    // }
    console.log("ASSDDDD");
    // (await this.artistRepository.tracks(id).find(filter2)).forEach((el) => {
    //   el.timesPlayed += 1
    //   await this.trackRepository.updateById(el.ID, el)


    // });
    const a = await this.albumRepository.tracks(id).find(filter2);
    // for (let index = 0; index < a.length; index++) {
    //   const el = a[index];
    //   el.timesPlayed++
    //   //await this.trackRepository.updateById(el.ID, el)

    // }

    for (const el of a) {

      el.timesPlayed++
      await this.trackRepository.updateById(el.ID, el)

    }

    //return {};



  }
}
