import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Album, Artist, ArtistRelations, Track} from '../models';
import {AlbumRepository} from './album.repository';
import {TrackRepository} from './track.repository';

export class ArtistRepository extends DefaultCrudRepository<
  Artist,
  typeof Artist.prototype.ID,
  ArtistRelations
> {

  public readonly albums: HasManyRepositoryFactory<Album, typeof Artist.prototype.ID>;
  public readonly tracks: HasManyRepositoryFactory<Track, typeof Album.prototype.ID>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('AlbumRepository') protected albumRepositoryGetter: Getter<AlbumRepository>, @repository.getter('TrackRepository') protected trackRepositoryGetter: Getter<TrackRepository>,
  ) {
    super(Artist, dataSource);
    this.albums = this.createHasManyRepositoryFactoryFor('albums', albumRepositoryGetter,);
    this.registerInclusionResolver('albums', this.albums.inclusionResolver);
    this.tracks = this.createHasManyRepositoryFactoryFor('tracks', trackRepositoryGetter,);
    this.registerInclusionResolver('tracks', this.tracks.inclusionResolver);
  }
}
