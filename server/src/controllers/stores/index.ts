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
import ForbiddenError from '@/errors/forbidden.js'

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
  if (!userId) throw new UnauthorizedError('Sign-in to create store')
  // check if vendor account is enabled
  const result = await knex('users')
    .where('user_id', userId)
    .select('is_vendor')
    .limit(1)
  if (!result[0]?.is_vendor)
    throw new ForbiddenError(
      'Vendor account disabled. Need to enable it to create a store',
    )
  // Limit the amount of store addresses a user can have:
  const LIMIT = 5
  let { count } = (
    await knex('stores').where('vendor_id', userId).count('store_id')
  )[0]
  if (typeof count === 'string') count = parseInt(count)
  if (count > LIMIT)
    throw new ForbiddenError(`Cannot have more than ${LIMIT} stores`)
  //
  if (!isValidStoreDataRequest(body))
    throw new BadRequestError('Invalid store data')
  const storeData: StoreData = body

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
  query: { vendor_id },
}: QueryParams): Promise<Knex.QueryBuilder<StoreData[]>> => {
  // if (!userId) throw new UnauthorizedError('Cannot access resource') -- Must be public, anyone can access a store
  // For reads of private nature such as GET /products?unlisted=true, then Uathentication makes sense
  // check if vendor account is enabled
  const query = knex<StoreData>('stores').select('*')
  if (vendor_id) query.where('vendor_id', vendor_id) // Get all products from a specific vendor
  const stores = await query

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
}: QueryParams): Promise<Knex.QueryBuilder<StoreData[]>> => {
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { storeId } = params
  if (!storeId) throw new BadRequestError('Need Store ID to retrieve store')
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
  if (!userId) throw new UnauthorizedError('Signin to modify store.')
  if (params == null)
    throw new BadRequestError('No valid route parameters provided')
  const { storeId } = params
  if (!storeId) throw new BadRequestError('Need Store ID to update store')
  if (!isValidStoreDataRequest(body))
    throw new BadRequestError('Invalid request data')
  const storeData = body
  // check if vendor account is enabled
  const result = await knex('users')
    .where('user_id', userId)
    .select('is_vendor')
    .limit(1)
  if (!result[0]?.is_vendor)
    throw new ForbiddenError(
      'Vendor account disabled. Need to enable it to create a store',
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
    .where('vendor_id', userId) // <-- HUGE Flaw if not added
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
  if (!userId) throw new UnauthorizedError('Signin to delete store.')
  if (params == null)
    throw new BadRequestError('No valid route parameters provided')
  const { storeId } = params
  if (!storeId) throw new BadRequestError('Need store ID param to delete store')
  // check if vendor account is enabled
  const result = await knex('users')
    .where('user_id', userId)
    .select('is_vendor')
    .limit(1)
  if (!result[0]?.is_vendor)
    throw new ForbiddenError(
      'Vendor account disabled. Need to enable it to create a store',
    )
  return knex<StoreData>('stores')
    .where('store_id', storeId)
    .where('vendor_id', userId) // <-- HUGE Flaw if not added
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
