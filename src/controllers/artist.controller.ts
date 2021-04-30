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
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,







  Request, requestBody, response,












  Response,
  RestBindings
} from '@loopback/rest';
import {Artist} from '../models';
import {ArtistRepository} from '../repositories';

export class ArtistController {
  constructor(
    @repository(ArtistRepository) public artistRepository: ArtistRepository,
    @inject(RestBindings.Http.RESPONSE) public res: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,

  ) { }

  // @post('/artists')
  // @response(200, {
  //   description: 'Artist model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(Artist)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Artist, {
  //           title: 'NewArtist',
  //           exclude: ['ID', "self"],

  //         }),
  //       },
  //     },
  //   })
  //   artist: Artist,
  // ): Promise<Artist> {
  //   artist.ID = Buffer.from(artist.name.substring(0, 22)).toString('base64')
  //   return this.artistRepository.create(artist);
  // }


  @post('/artists')
  @response(200, {
    description: 'Artist model instance',
    content: {'application/json': {schema: getModelSchemaRef(Artist)}},
  })
  @response(409, {
    description: 'Artist model instance',
    content: {'application/json': {schema: getModelSchemaRef(Artist)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Artist, {
            title: 'NewArtist',
            exclude: ['ID'],

          }),
        },
      },
    })
    artist: Artist,
  ): Promise<object> {
    artist.ID = Buffer.from(artist.name.substring(0, 22)).toString('base64')

    if (await this.artistRepository.exists(artist.ID)) {
      this.res.status(409);
      //throw new HttpErrors.Conflict("Mensaje de error");
      const artist2 = await this.artistRepository.findById(artist.ID)
      return {
        id: artist2.ID,
        name: artist2.name,
        age: artist2.age,
        albums: this.request.get('host') + "/artists" + artist.ID + "/albums",
        tracks: this.request.get('host') + "/artists" + artist.ID + "/tracks",
        self: this.request.get('host') + "/artists" + artist.ID,
      };
    };
    await this.artistRepository.create(artist);

    return {
      id: artist.ID,
      name: artist.name,
      age: artist.age,
      albums: this.request.get('host') + "/artists/" + artist.ID + "/albums",
      tracks: this.request.get('host') + "/artists/" + artist.ID + "/tracks",
      self: this.request.get('host') + "/artists/" + artist.ID,
    };
  }



  @get('/artists/count')
  @response(200, {
    description: 'Artist model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Artist) where?: Where<Artist>,
  ): Promise<Count> {
    return this.artistRepository.count(where);
  }

  @get('/artists')
  @response(200, {
    description: 'Array of Artist model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Artist, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Artist) filter?: Filter<Artist>,
  ): Promise<Artist[]> {
    return this.artistRepository.find(filter);
  }

  @patch('/artists')
  @response(200, {
    description: 'Artist PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Artist, {partial: true}),
        },
      },
    })
    artist: Artist,
    @param.where(Artist) where?: Where<Artist>,
  ): Promise<Count> {
    return this.artistRepository.updateAll(artist, where);
  }

  @get('/artists/{id}')
  @response(200, {
    description: 'Artist model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Artist, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Artist, {exclude: 'where'}) filter?: FilterExcludingWhere<Artist>
  ): Promise<Artist> {
    return this.artistRepository.findById(id, filter);
  }

  @patch('/artists/{id}')
  @response(204, {
    description: 'Artist PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Artist, {partial: true}),
        },
      },
    })
    artist: Artist,
  ): Promise<void> {
    await this.artistRepository.updateById(id, artist);
  }

  @put('/artists/{id}')
  @response(204, {
    description: 'Artist PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() artist: Artist,
  ): Promise<void> {
    await this.artistRepository.replaceById(id, artist);
  }

  @del('/artists/{id}')
  @response(204, {
    description: 'Artist DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.artistRepository.deleteById(id);
  }
}
