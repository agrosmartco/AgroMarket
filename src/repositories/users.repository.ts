import { DefaultCrudRepository, HasOneRepositoryFactory, juggler, repository } from '@loopback/repository';
import { Users, UsersRelations } from '../models';
import { MongoDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';

export type Credentials = {
  email: string;
  password: string;
};

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id,
  UsersRelations
  > {

  constructor(
    @inject('datasources.mongo') dataSource: juggler.DataSource,

  ) {
    super(Users, dataSource);

  }


}
