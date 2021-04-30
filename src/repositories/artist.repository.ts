import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Artist, ArtistRelations, Album} from '../models';
import {AlbumRepository} from './album.repository';

export class ArtistRepository extends DefaultCrudRepository<
  Artist,
  typeof Artist.prototype.ID,
  ArtistRelations
> {

  public readonly albums: HasManyRepositoryFactory<Album, typeof Artist.prototype.ID>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('AlbumRepository') protected albumRepositoryGetter: Getter<AlbumRepository>,
  ) {
    super(Artist, dataSource);
    this.albums = this.createHasManyRepositoryFactoryFor('albums', albumRepositoryGetter,);
    this.registerInclusionResolver('albums', this.albums.inclusionResolver);
  }
}
