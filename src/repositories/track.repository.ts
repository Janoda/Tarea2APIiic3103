import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Track, TrackRelations, Album} from '../models';
import {AlbumRepository} from './album.repository';

export class TrackRepository extends DefaultCrudRepository<
  Track,
  typeof Track.prototype.ID,
  TrackRelations
> {

  public readonly album: BelongsToAccessor<Album, typeof Track.prototype.ID>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('AlbumRepository') protected albumRepositoryGetter: Getter<AlbumRepository>,
  ) {
    super(Track, dataSource);
    this.album = this.createBelongsToAccessorFor('album', albumRepositoryGetter,);
    this.registerInclusionResolver('album', this.album.inclusionResolver);
  }
}
