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
import assert from 'assert'

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
  userId,
}: QueryParams): Promise<Knex.QueryBuilder<string>> => {
  if (!userId) throw new UnauthorizedError('Cannot access resource')
  // check if vendor account is enabled
  const result = await knex('users')
    .where('user_id', userId)
    .select('is_vendor')
    .limit(1)
  assert(!!result && result.length === 1)
  if (result[0] === false)
    throw new BadRequestError(
      'Vendor account disabled. Need to enable it to create a shipping address',
    )
  // Limit the amount of store addresses a user can have:
  const LIMIT = 5
  let { count } = (
    await knex('stores').where('vendor_id', userId).count('store_id')
  )[0]
  if (typeof count === 'string') count = parseInt(count)
  if (count > LIMIT)
    throw new BadRequestError(`Cannot have more than ${LIMIT} stores`)
  //
  if (!isValidStoreDataRequest(body))
    throw new BadRequestError('Invalid store data')
  const storeData: StoreData = body
  if (!storeData) throw new BadRequestError('No data sent in request body')

  const dBFriendlyStoreData: DBFriendlyStoreData = {
    ...storeData,
    store_pages: storeData.store_pages
      ? JSON.stringify(storeData.store_pages)
      : undefined,
    default_page_styling: storeData.default_page_styling
      ? JSON.stringify(storeData.default_page_styling)
      : undefined,
  }
  return knex<DBFriendlyStoreData>('stores')
    .insert({ vendor_id: userId, ...dBFriendlyStoreData })
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
  userId,
}: QueryParams): Promise<Knex.QueryBuilder<StoreData[]>> => {
  if (!userId) throw new UnauthorizedError('Cannot access resource')
  // check if vendor account is enabled
  const result = await knex('users')
    .where('user_id', userId)
    .select('is_vendor')
    .limit(1)
  assert(!!result && result.length === 1)
  console.log('Get All Stores ->' + JSON.stringify(result))
  if (result[0] === false)
    throw new BadRequestError(
      'Vendor account disabled. Need to enable it to create a shipping address',
    )
  const stores = await knex<StoreData>('stores')
    .where('vendor_id', userId)
    .select('*')

  return stores.map((store) => ({
    ...store,
    store_pages: store.store_pages
      ? JSON.parse(JSON.stringify(store.store_pages))
      : undefined,
    default_page_styling: store.default_page_styling
      ? JSON.parse(JSON.stringify(store.default_page_styling))
      : undefined,
  }))
}

/* @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieves a single store data for a vendor
 * Checks:
 * 1. If the vendor account exists
 */

const getQuery = async ({
  params,
  userId,
}: QueryParams): Promise<Knex.QueryBuilder<StoreData[]>> => {
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { storeId } = params
  if (!userId) throw new UnauthorizedError('Cannot access resource')
  // check if vendor account is enabled
  const result = await knex('users')
    .where('user_id', userId)
    .select('is_vendor')
    .limit(1)
  assert(!!result && result.length === 1)
  if (result[0] === false)
    throw new BadRequestError(
      'Vendor account disabled. Need to enable it to create a shipping address',
    )
  const store = await knex<StoreData>('stores')
    .where('store_id', storeId)
    .select('*')
    .first()

  if (!store) return [] // return an empty list

  return [
    {
      ...store,
      store_pages: store.store_pages
        ? JSON.parse(JSON.stringify(store.store_pages))
        : undefined,
      default_page_styling: store.default_page_styling
        ? JSON.parse(JSON.stringify(store.default_page_styling))
        : undefined,
    },
  ]
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
  userId,
}: QueryParams): Promise<Knex.QueryBuilder<number>> => {
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { storeId } = params
  if (!isValidStoreDataRequest(body)) throw new BadRequestError('Invalid data')
  const storeData = body
  if (!storeId) throw new BadRequestError('Need ID to update resource')
  if (!userId) throw new UnauthorizedError('Cannot access resource')
  // check if vendor account is enabled
  const result = await knex('users')
    .where('user_id', userId)
    .select('is_vendor')
    .limit(1)
  assert(!!result && result.length === 1)
  if (result[0] === false)
    throw new BadRequestError(
      'Vendor account disabled. Need to enable it to create a shipping address',
    )
  const dBFriendlyStoreData: DBFriendlyStoreData = {
    ...storeData,
    store_pages: storeData.store_pages
      ? JSON.stringify(storeData.store_pages)
      : undefined,
    default_page_styling: storeData.default_page_styling
      ? JSON.stringify(storeData.default_page_styling)
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
  userId,
}: QueryParams): Promise<Knex.QueryBuilder<string>> => {
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { storeId } = params
  if (!storeId) throw new BadRequestError('Need Id param to delete resource')
  if (!userId) throw new UnauthorizedError('Cannot access resource')
  // check if vendor account is enabled
  const result = await knex('users')
    .where('user_id', userId)
    .select('is_vendor')
    .limit(1)
  assert(!!result && result.length === 1)
  if (result[0] === false)
    throw new BadRequestError(
      'Vendor account disabled. Need to enable it to create a shipping address',
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
