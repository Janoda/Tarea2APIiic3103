import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Album,
  Artist,
} from '../models';
import {AlbumRepository} from '../repositories';

export class AlbumArtistController {
  constructor(
    @repository(AlbumRepository)
    public albumRepository: AlbumRepository,
  ) { }

  @get('/albums/{id}/artist', {
    responses: {
      '200': {
        description: 'Artist belonging to Album',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Artist)},
          },
        },
      },
    },
  })
  async getArtist(
    @param.path.string('id') id: typeof Album.prototype.ID,
  ): Promise<Artist> {
    return this.albumRepository.artist(id);
  }
}
