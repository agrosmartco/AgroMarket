import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { Users } from '../models';
import { UsersRepository } from '../repositories';
import { hashPassword, comparePassword } from "../services/hash.password.bcryptjs";
import { jwtToken } from "../services/jwt-auth";
import { validateCredentials } from "../services/validator";
import { basicAuthorization } from '../services/authorizer';
import { Credentials } from '../repositories/users.repository';
import {
  CredentialsRequestBody,
} from './specs/user-controller.specs';
import _ from "lodash";
import { MyUserService } from '../services/user-service';

export class UsersController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    // @inject(UserServiceBindings.USER_SERVICE)
    // public userService: UserService<Users, Credentials>
  ) { }

  @post('/users', {
    responses: {
      '200': {
        description: 'Users model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Users) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {
            title: 'NewUsers',
            exclude: ['id'],
          }),
        },
      },
    })
    users: Omit<Users, 'id'>,
  ): Promise<any> {
    console.log(users);

    // All new users have the "customer" role by default
    users.roles = ['customer'];
    //Validate email
    await validateCredentials(_.pick(users, ['email', 'password']))
    //Encryp pass
    users.password = await hashPassword(users.password, 10);
    //Saving a new user      
    const savedUser = await this.usersRepository.create(users);
    //Token
    const token: string = await jwtToken(savedUser.id)
    return { token };
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'Users model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Users)) where?: Where<Users>,
  ): Promise<Count> {
    return this.usersRepository.count(where);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of Users model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Users, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Users)) filter?: Filter<Users>,
  ): Promise<Users[]> {
    return this.usersRepository.find(filter);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'Users PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, { partial: true }),
        },
      },
    })
    users: Users,
    @param.query.object('where', getWhereSchemaFor(Users)) where?: Where<Users>,
  ): Promise<Count> {
    return this.usersRepository.updateAll(users, where);
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'Users model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Users, { includeRelations: true }),
          },
        },
      },
    },
  })
  @authorize({
    allowedRoles: ['admin', 'support', 'customer'],
    voters: [basicAuthorization],
  })
  async findById(
    @param.path.number('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Users)) filter?: Filter<Users>
  ): Promise<Users> {
    return this.usersRepository.findById(id, filter);
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'Users PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, { partial: true }),
        },
      },
    })
    users: Users,
  ): Promise<void> {
    await this.usersRepository.updateById(id, users);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'Users PUT success',
      },
    },
  })
  @authorize({
    allowedRoles: ['admin', 'customer'],
    voters: [basicAuthorization],
  })
  async replaceById(
    @param.path.number('id') id: string,
    @requestBody() users: Users,
  ): Promise<void> {
    await this.usersRepository.replaceById(id, users);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'Users DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usersRepository.deleteById(id);
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{ token: string }> {
    // ensure the user exists, and the password is correct
    const user = await MyUserService.prototype.verifyCredentials(credentials);

    //Compare pass
    const correctPassword: boolean = await comparePassword(credentials.password, user.password);

    // // convert a User object into a UserProfile object (reduced set of properties)
    // const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await jwtToken(Users);

    return { token };
  }


}
