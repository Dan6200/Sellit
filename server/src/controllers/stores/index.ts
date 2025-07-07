import { StatusCodes } from 'http-status-codes'
import {
  StoreDataRequestSchema,
  StoreDataResponseListSchema,
  StoreIDSchema,
  StoreDataResponseSchema,
} from '@/app-schema/stores.js'
import BadRequestError from '../../errors/bad-request.js'
import UnauthorizedError from '../../errors/unauthorized.js'
import {
  ProcessRoute,
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../types/process-routes.js'
import StoreData, {
  DBFriendlyStoreData,
  isValidStoreDataRequest,
} from '../../types/store-data.js'
import processRoute from '../routes/process.js'
import { validateReqData } from '../utils/request-validation.js'
import { validateResData } from '../utils/response-validation.js'
import { Knex } from 'knex'
import { knex } from '@/db/index.js'

/**
 * @param {QueryParams} qp
 * @returns {Promise<number>}
 * @description Create a new store data for a vendor
 * Checks:
 * 1. If the vendor exists
 * 2. If the vendor already has 5 store addresses
 */

const createQuery = async ({
  body,
  userId: vendorId,
}: QueryParams): Promise<Knex.QueryBuilder<string>> => {
  if (!vendorId) throw new UnauthorizedError('Cannot access resource')
  // check if vendor account exists
  const result = await knex('vendors')
    .where('vendor_id', vendorId)
    .select('vendor_id')
  if (result.length === 0)
    throw new BadRequestError(
      'No vendor account found. Please create a vendor account',
    )
  // Limit the amount of store addresses a user can have:
  const LIMIT = 5
  let { count } = (
    await knex('stores').where('vendor_id', vendorId).count('store_id')
  )[0]
  if (typeof count === 'string') count = parseInt(count)
  if (count > LIMIT)
    throw new BadRequestError(`Cannot have more than ${LIMIT} stores`)
  //
  if (!isValidStoreDataRequest(body))
    throw new BadRequestError('Invalid store data')
  const storeData: StoreData = body
  if (!storeData) throw new BadRequestError('No data sent in request body')
  return knex<StoreData>('stores')
    .insert({ vendor_id: vendorId, ...storeData })
    .returning('store_id')
}

/*
 * @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieves all the store data for a vendor
 * Checks:
 * 1. If the vendor account exists
 */

const getAllQuery = async ({
  userId: vendorId,
}: QueryParams): Promise<Knex.QueryBuilder<StoreData[]>> => {
  if (!vendorId) throw new UnauthorizedError('Cannot access resource')
  const result = await knex('vendors')
    .where('vendor_id', vendorId)
    .select('vendor_id')
  if (result.length === 0)
    throw new BadRequestError(
      'No vendor account found. Please create a vendor account',
    )
  return knex<StoreData>('stores').where('vendor_id', vendorId).select('*')
}

/* @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieves a single store data for a vendor
 * Checks:
 * 1. If the vendor account exists
 */

const getQuery = async ({
  params,
  userId: vendorId,
}: QueryParams): Promise<Knex.QueryBuilder<StoreData[]>> => {
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { storeId } = params
  if (!vendorId) throw new UnauthorizedError('Cannot access resource')
  const result = await knex('vendors')
    .where('vendor_id', vendorId)
    .select('vendor_id')
  if (result.length === 0)
    throw new BadRequestError(
      'No vendor account found. Please create a vendor account',
    )
  return knex<StoreData>('stores').where('store_id', storeId).select('*')
}

/* @param {QueryParams} qp
 * @returns {Promise<number>}
 * @description Updates store data for the vendor
 * Checks:
 * 1. If the vendor owns the store data
 * 2. If the store data ID is provided
 * 3. If the vendor exists
 */

const updateQuery = async ({
  params,
  body,
  userId: vendorId,
}: QueryParams): Promise<Knex.QueryBuilder<number>> => {
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { storeId } = params
  if (!isValidStoreDataRequest(body)) throw new BadRequestError('Invalid data')
  const storeData = body
  if (!storeId) throw new BadRequestError('Need ID to update resource')
  if (!vendorId) throw new UnauthorizedError('Cannot access resource')
  const result = await knex('vendors')
    .where('vendor_id', vendorId)
    .select('vendor_id')
  if (result.length === 0)
    throw new BadRequestError(
      'No vendor account found. Please create a vendor account',
    )
  const dBFriendlyStoreData: DBFriendlyStoreData = {
    ...storeData,
    store_page: storeData.store_page
      ? JSON.stringify(storeData.store_page)
      : undefined,
  }

  return knex<DBFriendlyStoreData>('stores')
    .where('store_id', storeId)
    .update(dBFriendlyStoreData)
    .returning('store_id')
}

/* @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Deletes a store data for the vendor
 * Checks:
 * 1. If Id is provided
 * 2. If vendor account exists
 * 3. If vendor owns the store data
 */

const deleteQuery = async ({
  params,
  userId: vendorId,
}: QueryParams): Promise<Knex.QueryBuilder<string>> => {
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { storeId } = params
  if (!storeId) throw new BadRequestError('Need Id param to delete resource')
  if (!vendorId) throw new UnauthorizedError('Cannot access resource')
  const result = await knex('vendors')
    .where('vendor_id', vendorId)
    .select('vendor_id')
  if (result.length === 0)
    throw new BadRequestError(
      'No vendor account found. Please create a vendor account',
    )
  return knex<StoreData>('stores')
    .where('store_id', storeId)
    .del()
    .returning('store_id')
}

const { CREATED, OK } = StatusCodes

const processPostRoute = <ProcessRoute>processRoute
export const createStore = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateBody: validateReqData(StoreDataRequestSchema),
  validateResult: validateResData(StoreIDSchema),
})

const processGetAllRoute = <ProcessRouteWithoutBody>processRoute
export const getAllStores = processGetAllRoute({
  Query: getAllQuery,
  status: OK,
  validateResult: validateResData(StoreDataResponseListSchema),
})

const processGetRoute = <ProcessRouteWithoutBody>processRoute
export const getStore = processGetRoute({
  Query: getQuery,
  status: OK,
  validateResult: validateResData(StoreDataResponseSchema),
})

const processPutRoute = <ProcessRoute>processRoute
export const updateStore = processPutRoute({
  Query: updateQuery,
  status: OK,
  validateBody: validateReqData(StoreDataRequestSchema),
  validateResult: validateResData(StoreIDSchema),
})

const processDeleteRoute = <ProcessRouteWithoutBody>processRoute
export const deleteStore = processDeleteRoute({
  Query: deleteQuery,
  status: OK,
  validateResult: validateResData(StoreIDSchema),
})
