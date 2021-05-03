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
import {Artist, Track} from '../models';
import {AlbumRepository, ArtistRepository, TrackRepository} from '../repositories';
type Artistreturn = {id: string, name: string, age: number, albums: string, tracks: string, self: string};
// eslint-disable-next-line @typescript-eslint/naming-convention
type Trackreturn = {id: string, album_id: string, name: string, duration: number, times_played: number, artist: string, album: string, self: string};


export class ArtistController {
  constructor(
    @repository(ArtistRepository) public artistRepository: ArtistRepository,
    @repository(AlbumRepository) public albumRepository: AlbumRepository,
    @repository(TrackRepository) public trackRepository: TrackRepository,
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
  @response(201, {
    description: 'Artista creado',
    content: {'application/json': {schema: getModelSchemaRef(Artist)}},
  })
  @response(400, {
    description: 'Input invalido',
  })
  @response(409, {
    description: 'Artista ya existe',
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
    artist.ID = Buffer.from(artist.name).toString('base64').substring(0, 22)

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
    this.res.status(201);
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
  ): Promise<Artistreturn[]> {
    const ra: Artistreturn[] = [];
    console.log("get artists");

    (await this.artistRepository.find(filter)).forEach((el) => {
      const a = {} as Artistreturn;
      a.id = el.ID
      a.name = el.name
      a.age = el.age
      a.albums = this.request.get('host') + "/artists/" + el.ID + "/albums"
      a.tracks = this.request.get('host') + "/artists/" + el.ID + "/tracks"
      a.self = this.request.get('host') + "/artists/" + el.ID
      ra.push(a);

    });
    return ra;
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
  @response(404, {
    description: 'No encontrado artista',

  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Artist, {exclude: 'where'}) filter?: FilterExcludingWhere<Artist>
  ): Promise<Artistreturn | void> {
    const re = {} as Artistreturn;

    if (!await this.artistRepository.exists(id)) {
      this.res.status(404).send()
      return
    } else {
      const a = await this.artistRepository.findById(id, filter)
      re.id = a.ID
      re.name = a.name
      re.age = a.age
      re.albums = this.request.get('host') + "/artists/" + a.ID + "/albums"
      re.tracks = this.request.get('host') + "/artists/" + a.ID + "/tracks"
      re.self = this.request.get('host') + "/artists/" + a.ID
      return re;
    }

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
  @response(404, {
    description: 'Artist DELETE not found',
  })
  async deleteById(@param.path.string('id') id: string,
  ): Promise<void> {
    // console.log("11111")
    // // if (!await this.artistRepository.exists(id)) {
    // //   console.log("yesp")
    // //   this.res.status(404)
    // //   return
    // // }
    // console.log("NOOOO")
    console.log("NO ENTRE NUCNA");
    if (!await this.artistRepository.exists(id)) {
      console.log("yesp")
      this.res.status(404).send()

    } else {
      await this.artistRepository.deleteById(id);
      await this.artistRepository.tracks(id).delete();
      await this.artistRepository.albums(id).delete();
    }


  }

  @get('/artists/{id}/tracks')
  @response(200, {
    description: 'Track get',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Track, {includeRelations: true}),
        },
      },
    },
  })
  @response(404, {
    description: 'Artista Invalido',
  })
  async find2(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Track>,
  ): Promise<Trackreturn[] | void> {
    const ra: Trackreturn[] = [];
    if (! await this.artistRepository.exists(id)) {
      this.res.status(404).send()
      //throw HttpErrors.404("error")
      return;
    } else {
      this.res.status(200);
      (await this.artistRepository.tracks(id).find(filter)).forEach((el) => {
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

  }


  @put('/artists/{id}/albums/play')
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


    if (!await this.artistRepository.exists(id)) {
      console.log("yesp")
      this.res.status(404).send()

    } else {

      const a = await this.artistRepository.tracks(id).find(filter2);


      for (const el of a) {

        el.timesPlayed++
        await this.trackRepository.updateById(el.ID, el)

      }
      this.res.status(200).send()
    }


    //return {};



  }


}
