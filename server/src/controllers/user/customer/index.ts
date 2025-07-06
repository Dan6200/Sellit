import { StatusCodes } from 'http-status-codes'
import {
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../../types/process-routes.js'
import createRouteProcessor from '../../routes/process.js'
import { CustomerSchemaID } from '../../../app-schema/customers.js'
import { validateResData } from '@/controllers/utils/response-validation.js'
import { knex } from '@/db/index.js'
import { Knex } from 'knex'

const { CREATED, OK } = StatusCodes

/**
 * @description Add a customer account to the database
 **/
const createQuery = async ({
  userId: customerId,
}: QueryParams): Promise<Knex.QueryBuilder> =>
  knex('customers').insert({ customer_id: customerId }).returning('customer_id')

/**
 * @description Delete the customer account from the database
 **/
const deleteQuery = async ({
  userId: customerId,
}: QueryParams): Promise<Knex.QueryBuilder> =>
  knex('customers')
    .where('customer_id', customerId)
    .del()
    .returning('customer_id')

const processPostRoute = <ProcessRouteWithoutBody>createRouteProcessor
const processDeleteRoute = <ProcessRouteWithoutBody>createRouteProcessor

export const postCustomer = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateResult: validateResData(CustomerSchemaID),
})

export const deleteCustomer = processDeleteRoute({
  Query: deleteQuery,
  status: OK,
  validateResult: validateResData(CustomerSchemaID),
})
