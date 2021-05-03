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


  Request, requestBody, response, Response,



  RestBindings
} from '@loopback/rest';
import {
  Album,
  Track
} from '../models';
import {AlbumRepository, TrackRepository} from '../repositories';

type Trackreturn = {id: string, album_id: string, name: string, duration: number, times_played: number, artist: string, album: string, self: string};

export class AlbumTrackController {
  constructor(
    @repository(AlbumRepository) protected albumRepository: AlbumRepository,
    @repository(TrackRepository) protected trackRepository: TrackRepository,
    @inject(RestBindings.Http.RESPONSE) public res: Response,
    @inject(RestBindings.Http.REQUEST) public request: Request,
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
  ): Promise<Trackreturn[] | void> {
    const ra: Trackreturn[] = [];
    if (! await this.albumRepository.exists(id)) {
      this.res.status(404).send()
      //throw HttpErrors.404("error")
      return;
    } else {
      this.res.status(200);
      (await this.albumRepository.tracks(id).find(filter)).forEach((el) => {
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

  @post('/albums/{id}/tracks')
  @response(201, {
    description: 'Track creado',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Track, {includeRelations: true}),
      },
    },
  })
  @response(400, {
    description: 'Input Invalido',
  })
  @response(409, {
    description: 'Track ya existe',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Track, {includeRelations: true}),
      },
    },
  })
  @response(422, {
    description: 'Album no existe',
  })
  async create(
    @param.path.string('id') id: typeof Album.prototype.ID,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Track, {
            title: 'NewTrackInAlbum',
            exclude: ['ID', 'timesPlayed', 'albumId', 'artistId'],
            optional: ['albumId', 'artistId']
          }),
        },
      },
    }) track: Track,
  ): Promise<object> {
    track.ID = Buffer.from(track.name + ":" + id).toString('base64').substring(0, 22)
    //track.ID = Buffer.from(track.name).toString('base64').substring(0, 22)

    if (!await this.albumRepository.exists(id)) {
      //console.log("ENTRE-------")
      this.res.status(422)
      return {error: "Album no existe"}
    }
    if (await this.trackRepository.exists(track.ID)) {
      console.log("WHYYY")
      const track2 = await this.trackRepository.findById(track.ID)
      this.res.status(409)
      return ({
        id: track2.ID,
        album_id: track2.albumId,
        name: track2.name,
        duration: track2.duration,
        times_played: track2.timesPlayed,
        artist: this.request.get('host') + "/artists/" + track2.artistId,
        album: this.request.get('host') + "/albums/" + track2.albumId,
        self: this.request.get('host') + "/tracks/" + track2.ID,

      })
    }
    const album = await this.albumRepository.findById(id)
    track.artistId = album.artistId
    await this.albumRepository.tracks(id).create(track);
    this.res.status(201)
    console.log("POQRRR")
    console.log(track.timesPlayed)
    track.timesPlayed = 0
    return ({
      id: track.ID,
      album_id: track.albumId,
      name: track.name,
      duration: track.duration,
      times_played: track.timesPlayed,
      //times_played: track.timesPlayed,
      artist: this.request.get('host') + "/artists/" + track.artistId,
      album: this.request.get('host') + "/albums/" + id,
      self: this.request.get('host') + "/tracks/" + track.ID,

    })
  }
  // {
  //   return this.albumRepository.tracks(id).create(track);
  // }

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
