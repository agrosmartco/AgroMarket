import { DefaultCrudRepository, HasOneRepositoryFactory, juggler, repository } from '@loopback/repository';
import { Users, UsersRelations } from '../models';
import { UserCredentials } from "../models/user-credentials.model";
import { UserCredentialsRepository } from "../repositories/user-credentials.respository";
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

  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof Users.prototype.id
  >;

  constructor(
    @inject('datasources.mongo') dataSource: juggler.DataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<
      UserCredentialsRepository
    >,
  ) {
    super(Users, dataSource);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
  }

  async findCredentials(
    userId: typeof Users.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }

}
