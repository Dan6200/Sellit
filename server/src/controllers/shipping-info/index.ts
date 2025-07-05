import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'
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
} from '../../types-and-interfaces/process-routes.js'
import ShippingInfo, {
  isValidShippingInfoRequest,
} from '../../types-and-interfaces/shipping-info.js'
import processRoute from '../routes/process.js'
import { validateReqData } from '../utils/request-validation.js'
import { validateResData } from '../utils/response-validation.js'

/**
 * @param {QueryParams} qp
 * @returns {Promise<number>}
 * @description Create a new shipping info for a customer
 * Checks:
 * 1. If the customer exists
 * 2. If the customer already has 5 shipping addresses
 */

const createQuery = async <T>({
  body,
  uid: customerId,
}: QueryParams<T>): Promise<number> => {
  if (!customerId) throw new UnauthorizedError('Cannot access resource')
  // check if customer account exists
  const result = await knex('customers')
    .where('customer_id', customerId)
    .select('customer_id')
  if (result.length === 0)
    throw new BadRequestError(
      'No Customer account found. Please create a Customer account',
    )
  // Limit the amount of shipping addresses a user can have:
  const LIMIT = 5
  let { count } = (
    await knex('shipping_info')
      .where('customer_id', customerId)
      .count('shipping_info_id')
  )[0]
  if (typeof count === 'string') count = parseInt(count)
  if (count > LIMIT)
    throw new BadRequestError(`Cannot have more than ${LIMIT} stores`)

  if (!isValidShippingInfoRequest(body))
    throw new BadRequestError('Invalid shipping info')
  const shippingData: ShippingInfo = body
  if (!shippingData) throw new BadRequestError('No data sent in request body')
  const DBFriendlyData = {
    ...shippingData,
    delivery_instructions: JSON.stringify(shippingData.delivery_instructions),
  }
  return knex<ShippingInfo>('shipping_info')
    .insert({ customer_id: customerId, ...DBFriendlyData })
    .returning('shipping_info_id')
}

/*
 * @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieves all the shipping info for a customer
 * Checks:
 * 1. If the customer account exists
 */

const getAllQuery = async <T>({
  uid: customerId,
}: QueryParams<T>): Promise<ShippingInfo[]> => {
  if (!customerId) throw new UnauthorizedError('Cannot access resource')
  const result = await knex('customers')
    .where('customer_id', customerId)
    .select('customer_id')
  if (result.length === 0)
    throw new BadRequestError(
      'No Customer account found. Please create a Customer account',
    )
  return knex<ShippingInfo>('shipping_info')
    .where('customer_id', customerId)
    .select('*')
}

/* @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieves a single shipping info for a customer
 * Checks:
 * 1. If the customer account exists
 */

const getQuery = async <T>({
  params,
  uid: customerId,
}: QueryParams<T>): Promise<ShippingInfo[]> => {
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { shippingInfoId } = params
  if (!customerId) throw new UnauthorizedError('Cannot access resource')
  const result = await knex('customers')
    .where('customer_id', customerId)
    .select('customer_id')
  if (result.length === 0)
    throw new BadRequestError(
      'No Customer account found. Please create a Customer account',
    )
  return knex<ShippingInfo>('shipping_info')
    .where('shipping_info_id', shippingInfoId)
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

const updateQuery = async <T>({
  params,
  body,
  uid: customerId,
}: QueryParams<T>): Promise<number> => {
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { shippingInfoId } = params
  if (!isValidShippingInfoRequest(body))
    throw new BadRequestError('Invalid data')
  const shippingData = body
  if (!shippingInfoId) throw new BadRequestError('Need ID to update resource')
  if (!customerId) throw new UnauthorizedError('Cannot access resource')
  const result = await knex('customers')
    .where('customer_id', customerId)
    .select('customer_id')
  if (result.length === 0)
    throw new BadRequestError(
      'No Customer account found. Please create a Customer account',
    )
  const DBFriendlyData = {
    ...shippingData,
    delivery_instructions: JSON.stringify(shippingData.delivery_instructions),
  }
  return knex<ShippingInfo>('shipping_info')
    .where('shipping_info_id', shippingInfoId)
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

const deleteQuery = async <T>({
  params,
  uid: customerId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { shippingInfoId } = params
  if (!shippingInfoId)
    throw new BadRequestError('Need Id param to delete resource')
  if (!customerId) throw new UnauthorizedError('Cannot access resource')
  const result = await knex('customers')
    .where('customer_id', customerId)
    .select('customer_id')
  if (result.length === 0)
    throw new BadRequestError(
      'No Customer account found. Please create a Customer account',
    )
  return knex<ShippingInfo>('shipping_info')
    .where('shipping_info_id', shippingInfoId)
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
