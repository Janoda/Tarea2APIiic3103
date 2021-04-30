import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Track,
  Album,
} from '../models';
import {TrackRepository} from '../repositories';

export class TrackAlbumController {
  constructor(
    @repository(TrackRepository)
    public trackRepository: TrackRepository,
  ) { }

  @get('/tracks/{id}/album', {
    responses: {
      '200': {
        description: 'Album belonging to Track',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Album)},
          },
        },
      },
    },
  })
  async getAlbum(
    @param.path.string('id') id: typeof Track.prototype.ID,
  ): Promise<Album> {
    return this.trackRepository.album(id);
  }
}
