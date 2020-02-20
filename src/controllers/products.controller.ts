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
import {Products} from '../models';
import { basicAuthorization } from '../services/authorizer';
import { authorize } from '@loopback/authorization';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import {
  authenticate
} from '@loopback/authentication';
import {ProductsRepository} from '../repositories';

export class ProductsController {
  constructor(
    @repository(ProductsRepository)
    public productsRepository : ProductsRepository,
  ) {}

  @post('/products', {
    responses: {
      '200': {
        description: 'Products model instance',
        content: {'application/json': {schema: getModelSchemaRef(Products)}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {
            title: 'NewProducts',
            exclude: ['id'],
          }),
        },
      },
    })
    products: Omit<Products, 'id'>,
  ): Promise<Products> {
    return this.productsRepository.create(products);
  }

  @get('/products/count', {
    responses: {
      '200': {
        description: 'Products model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Products)) where?: Where<Products>,
  ): Promise<Count> {
    return this.productsRepository.count(where);
  }

  @get('/products', {
    responses: {
      '200': {
        description: 'Array of Products model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Products, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Products)) filter?: Filter<Products>,
  ): Promise<Products[]> {
    return this.productsRepository.find(filter);
  }

  @patch('/products', {
    responses: {
      '200': {
        description: 'Products PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {partial: true}),
        },
      },
    })
    products: Products,
    @param.query.object('where', getWhereSchemaFor(Products)) where?: Where<Products>,
  ): Promise<Count> {
    return this.productsRepository.updateAll(products, where);
  }

  @get('/products/{id}', {
    responses: {
      '200': {
        description: 'Products model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Products, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(Products)) filter?: Filter<Products>
  ): Promise<Products> {
    return this.productsRepository.findById(id, filter);
  }

  @patch('/products/{id}', {
    responses: {
      '204': {
        description: 'Products PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {partial: true}),
        },
      },
    })
    products: Products,
  ): Promise<void> {
    await this.productsRepository.updateById(id, products);
  }

  @put('/products/{id}', {
    responses: {
      '204': {
        description: 'Products PUT success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() products: Products,
  ): Promise<void> {
  
    await this.productsRepository.replaceById(id, products);
  }
  
  @del('/products/{id}', {
    responses: {
      '204': {
        description: 'Products DELETE success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin'],
    voters: [basicAuthorization],
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productsRepository.deleteById(id);
  }
}
