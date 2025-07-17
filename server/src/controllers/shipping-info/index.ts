import { StatusCodes } from 'http-status-codes'
import {
  ShippingInfoRequestSchema,
  ShippingInfoResponseListSchema,
  ShippingInfoSchemaID,
  ShippingInfoResponseSchema,
} from '../../app-schema/shipping.js'
import BadRequestError from '../../errors/bad-request.js'
import UnauthorizedError from '../../errors/unauthorized.js'
import {
  ProcessRoute,
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../types/process-routes.js'
import ShippingInfo, {
  isValidShippingInfoRequest,
} from '../../types/shipping-info.js'
import processRoute from '../process-routes.js'
import { validateReqData } from '../utils/request-validation.js'
import { validateResData } from '../utils/response-validation.js'
import { Knex } from 'knex'
import { knex } from '#src/db/index.js'
import ForbiddenError from '#src/errors/forbidden.js'

/**
 * @param {QueryParams} qp
 * @returns {Promise<number>}
 * @description Create a new shipping info for a customer
 * Checks:
 * 1. If the customer exists
 * 2. If the customer already has 5 shipping addresses
 */

const createQuery = async ({
  body,
  userId,
}: QueryParams): Promise<Knex.QueryBuilder<string>> => {
  if (!userId)
    throw new UnauthorizedError('Sign-in to access shipping information.')
  // check if customer account is enabled
  const result = await knex('profiles')
    .where('id', userId)
    .select('is_customer')
    .limit(1)
  if (!result[0]?.is_customer)
    throw new ForbiddenError(
      'Profile is not a customer. Only customers can create shipping addresses.',
    )
  // Limit the amount of shipping addresses a user can have:
  const LIMIT = 5
  let { count } = (
    await knex('shipping_info')
      .where('customer_id', userId)
      .count('shipping_info_id')
  )[0]
  if (typeof count === 'string') count = parseInt(count)
  if (count > LIMIT)
    throw new ForbiddenError(`Cannot have more than ${LIMIT} stores`)
  if (!isValidShippingInfoRequest(body))
    throw new BadRequestError('Invalid shipping info')
  const shippingData: ShippingInfo = body

  const DBFriendlyData = {
    ...shippingData,
    delivery_instructions: JSON.stringify(shippingData.delivery_instructions),
  }
  return knex<ShippingInfo>('shipping_info')
    .insert({ customer_id: userId, ...DBFriendlyData })
    .returning('shipping_info_id')
}

/*
 * @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieves all the shipping info for a customer
 * Checks:
 * 1. If the customer account exists
 */

const getAllQuery = async ({
  userId,
}: QueryParams): Promise<Knex.QueryBuilder<ShippingInfo[]>> => {
  if (!userId)
    throw new UnauthorizedError('Sign-in to access shipping information.')
  // check if customer account is enabled
  const result = await knex('profiles')
    .where('id', userId)
    .select('is_customer')
    .limit(1)
  if (!result[0]?.is_customer)
    throw new ForbiddenError(
      'Profile is not a customer. Only customers can create shipping addresses.',
    )
  return knex<ShippingInfo>('shipping_info')
    .where('customer_id', userId)
    .select('*')
}

/* @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieves a single shipping info for a customer
 * Checks:
 * 1. If the customer account exists
 */

const getQuery = async ({
  params,
  userId,
}: QueryParams): Promise<Knex.QueryBuilder<ShippingInfo[]>> => {
  if (!userId)
    throw new UnauthorizedError('Signin to access shipping information.')
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { shippingInfoId } = params
  // check if customer account is enabled
  const result = await knex('profiles')
    .where('id', userId)
    .select('is_customer')
    .limit(1)
  if (!result[0]?.is_customer)
    throw new ForbiddenError(
      'Profile is not a customer. Only customers can view shipping addresses.',
    )
  return knex<ShippingInfo>('shipping_info')
    .where('shipping_info_id', shippingInfoId)
    .where('customer_id', userId)
    .select('*')
}

/* @param {QueryParams} qp
 * @returns {Promise<number>}
 * @description Updates shipping info for the customer
 * Checks:
 * 1. If the customer owns the shipping info
 * 2. If the shipping info ID is provided
 * 3. If the customer exists
 */

const updateQuery = async ({
  params,
  body,
  userId,
}: QueryParams): Promise<Knex.QueryBuilder<number>> => {
  if (!userId)
    throw new UnauthorizedError('Signin to access shipping information.')
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { shippingInfoId } = params
  if (!isValidShippingInfoRequest(body))
    throw new BadRequestError('Invalid data')
  const shippingData = body
  if (!shippingInfoId)
    throw new BadRequestError('Need shipping-info ID to update resource')
  // check if customer account is enabled
  const result = await knex('profiles')
    .where('id', userId)
    .select('is_customer')
    .limit(1)
  if (!result[0]?.is_customer)
    throw new ForbiddenError(
      'Profile is not a customer. Only customers can view shipping addresses.',
    )
  const DBFriendlyData = {
    ...shippingData,
    delivery_instructions: JSON.stringify(shippingData.delivery_instructions),
  }
  return knex<ShippingInfo>('shipping_info')
    .where('shipping_info_id', shippingInfoId)
    .where('customer_id', userId)
    .update(DBFriendlyData)
    .returning('shipping_info_id')
}

/* @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Deletes a shipping info for the customer
 * Checks:
 * 1. If Id is provided
 * 2. If Customer account exists
 * 3. If Customer owns the shipping info
 */

const deleteQuery = async ({
  params,
  userId,
}: QueryParams): Promise<Knex.QueryBuilder<string>> => {
  if (!userId)
    throw new UnauthorizedError('Signin to delete shipping information.')
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { shippingInfoId } = params
  if (!shippingInfoId)
    throw new BadRequestError('Need Id param to delete resource')
  // check if customer account is enabled
  const result = await knex('profiles')
    .where('id', userId)
    .select('is_customer')
    .limit(1)
  if (!result[0]?.is_customer)
    throw new ForbiddenError(
      'Profile is not a customer. Only customers can delete shipping addresses.',
    )
  return knex<ShippingInfo>('shipping_info')
    .where('shipping_info_id', shippingInfoId)
    .where('customer_id', userId)
    .del()
    .returning('shipping_info_id')
}

const { CREATED, OK } = StatusCodes

const processPostRoute = <ProcessRoute>processRoute
const createShippingInfo = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateBody: validateReqData(ShippingInfoRequestSchema),
  validateResult: validateResData(ShippingInfoSchemaID),
})

const processGetAllRoute = <ProcessRouteWithoutBody>processRoute
const getAllShippingInfo = processGetAllRoute({
  Query: getAllQuery,
  status: OK,
  validateResult: validateResData(ShippingInfoResponseListSchema),
})

const processGetRoute = <ProcessRouteWithoutBody>processRoute
const getShippingInfo = processGetRoute({
  Query: getQuery,
  status: OK,
  validateResult: validateResData(ShippingInfoResponseSchema),
})

const processPutRoute = <ProcessRoute>processRoute
const updateShippingInfo = processPutRoute({
  Query: updateQuery,
  status: OK,
  validateBody: validateReqData(ShippingInfoRequestSchema),
  validateResult: validateResData(ShippingInfoSchemaID),
})

const processDeleteRoute = <ProcessRouteWithoutBody>processRoute
const deleteShippingInfo = processDeleteRoute({
  Query: deleteQuery,
  status: OK,
  validateResult: validateResData(ShippingInfoSchemaID),
})

export {
  createShippingInfo,
  getShippingInfo,
  getAllShippingInfo,
  updateShippingInfo,
  deleteShippingInfo,
}
