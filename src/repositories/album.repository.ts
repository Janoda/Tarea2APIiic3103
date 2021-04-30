import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Album, AlbumRelations, Track, Artist} from '../models';
import {TrackRepository} from './track.repository';
import {ArtistRepository} from './artist.repository';

export class AlbumRepository extends DefaultCrudRepository<
  Album,
  typeof Album.prototype.ID,
  AlbumRelations
> {

  public readonly tracks: HasManyRepositoryFactory<Track, typeof Album.prototype.ID>;

  public readonly artist: BelongsToAccessor<Artist, typeof Album.prototype.ID>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TrackRepository') protected trackRepositoryGetter: Getter<TrackRepository>, @repository.getter('ArtistRepository') protected artistRepositoryGetter: Getter<ArtistRepository>,
  ) {
    super(Album, dataSource);
    this.artist = this.createBelongsToAccessorFor('artist', artistRepositoryGetter,);
    this.registerInclusionResolver('artist', this.artist.inclusionResolver);
    this.tracks = this.createHasManyRepositoryFactoryFor('tracks', trackRepositoryGetter,);
    this.registerInclusionResolver('tracks', this.tracks.inclusionResolver);
  }
}
