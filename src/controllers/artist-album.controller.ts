/* eslint-disable @typescript-eslint/naming-convention */
import {inject} from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,

  param,
  patch,
  post,



  Request, requestBody,
  response,
  Response,

  RestBindings
} from '@loopback/rest';
import {
  Album, Artist
} from '../models';
import {AlbumRepository, ArtistRepository} from '../repositories';


// eslint-disable-next-line @typescript-eslint/naming-convention
type Albumreturn = {id: string, artist_id: string, name: string, genre: string, artist: string, tracks: string, self: string};

export class ArtistAlbumController {
  constructor(
    @repository(ArtistRepository) protected artistRepository: ArtistRepository,
    @repository(AlbumRepository) protected albumRepository: AlbumRepository,
    @inject(RestBindings.Http.RESPONSE) public res: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
  ) { }

  @get('/artists/{id}/albums')
  @response(200, {
    description: 'resultados obtenidos',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Album, {includeRelations: true}),
        },
      },
    },
  })
  @response(404, {
    description: 'Artista Invalido',
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Album>,
  ): Promise<Albumreturn[]> {
    const ra: Albumreturn[] = [];
    if (! await this.artistRepository.exists(id)) {
      this.res.status(404)
      //throw HttpErrors.404("error")
      return [];
    }
    (await this.artistRepository.albums(id).find(filter)).forEach((el) => {
      const a = {} as Albumreturn
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

  @post('/artists/{id}/albums')
  @response(201, {
    description: 'Album creado',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Album, {includeRelations: true}),
      },
    },
  })
  @response(400, {
    description: 'Input Invalido',
  })
  @response(409, {
    description: 'Album ya existe',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Album, {includeRelations: true}),
      },
    },
  })
  @response(422, {
    description: 'Artista no existe',
  })
  async create(
    @param.path.string('id') id: typeof Artist.prototype.ID,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Album, {
            title: 'NewAlbumInArtist',
            exclude: ['ID', "artistId"],
            optional: ['artistId']
          }),
        },
      },
    }) album: Album,
  ): Promise<object> {
    album.ID = Buffer.from(album.name + ":" + id).toString('base64').substring(0, 22)
    //album.ID = (album.name+":"+id).substring(0,22)
    //album.ID = Buffer.from(album.name).toString('base64').substring(0, 22)


    if (!await this.artistRepository.exists(id)) {
      //console.log("ENTRE")
      this.res.status(422)
      return {error: "Artista no existe"}
    }
    if (await this.albumRepository.exists(album.ID)) {
      const album2 = await this.albumRepository.findById(album.ID)
      this.res.status(409)
      return ({
        id: album2.ID,
        artist_id: album2.artistId,
        name: album2.name,
        genre: album2.genre,
        artist: this.request.get('host') + "/artists/" + id,
        tracks: this.request.get('host') + "/albums/" + album2.ID + "/tracks",
        self: this.request.get('host') + "/albums/" + album2.ID,

      })
    }
    await this.artistRepository.albums(id).create(album);
    this.res.status(201)
    return ({
      id: album.ID,
      artist_id: album.artistId,
      name: album.name,
      genre: album.genre,
      artist: this.request.get('host') + "/artists/" + id,
      tracks: this.request.get('host') + "/albums/" + album.ID + "/tracks",
      self: this.request.get('host') + "/albums/" + album.ID,

    })
  }

  @patch('/artists/{id}/albums', {
    responses: {
      '200': {
        description: 'Artist.Album PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Album, {partial: true}),
        },
      },
    })
    album: Partial<Album>,
    @param.query.object('where', getWhereSchemaFor(Album)) where?: Where<Album>,
  ): Promise<Count> {
    return this.artistRepository.albums(id).patch(album, where);
  }

  @del('/artists/{id}/albums', {
    responses: {
      '200': {
        description: 'Artist.Album DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Album)) where?: Where<Album>,
  ): Promise<Count> {
    return this.artistRepository.albums(id).delete(where);
  }
}
