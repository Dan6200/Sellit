import { StatusCodes } from 'http-status-codes'
import {
  DeliveryInfoRequestSchema,
  DeliveryInfoResponseListSchema,
  DeliveryInfoSchemaID,
  DeliveryInfoResponseSchema,
} from '../../app-schema/delivery-info.js'
import BadRequestError from '../../errors/bad-request.js'
import UnauthorizedError from '../../errors/unauthorized.js'
import {
  ProcessRoute,
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../types/process-routes.js'
import DeliveryInfo, {
  isValidDeliveryInfoRequest,
} from '../../types/delivery-info.js'
import processRoute from '../process-routes.js'
import { validateReqData } from '../utils/request-validation.js'
import { validateResData } from '../utils/response-validation.js'
import { Knex } from 'knex'
import { knex } from '#src/db/index.js'
import ForbiddenError from '#src/errors/forbidden.js'
import InternalServerError from '#src/errors/internal-server.js'

/**
 * @param {QueryParams} qp
 * @returns {Promise<number>}
 * @description Create a new delivery info for a customer
 * Checks:
 * 1. If the customer exists
 * 2. If the customer already has 5 delivery addresses
 */

const createQuery = async ({ body, userId }: QueryParams): Promise<any[]> => {
  if (!userId)
    throw new UnauthorizedError('Sign-in to access delivery information.')

  // Check if the profile is a customer
  const profile = await knex('profiles')
    .where('id', userId)
    .select('is_customer')
    .first()

  if (!profile?.is_customer) {
    throw new ForbiddenError(
      'Profile is not a customer. Only customers can create delivery addresses.',
    )
  }

  // Limit the amount of addresses a user can have
  const LIMIT = 3
  const countResult = await knex('delivery_info')
    .where('customer_id', userId)
    .count('delivery_info_id as count')
    .first()

  const count = Number(countResult?.count || 0)

  if (count >= LIMIT) {
    throw new ForbiddenError(`Cannot have more than ${LIMIT} addresses.`)
  }

  // Validate request body
  if (!isValidDeliveryInfoRequest(body)) {
    throw new BadRequestError('Invalid delivery info')
  }

  const {
    delivery_instructions,
    recipient_full_name,
    phone_number,
    address_line_1,
    address_line_2,
    city,
    state,
    zip_postal_code,
    country,
  } = body as DeliveryInfo

  // Use a transaction to ensure both inserts are successful
  const trx = await knex.transaction()
  try {
    const [address] = await trx('address')
      .insert({
        address_line_1,
        address_line_2,
        city,
        state,
        zip_postal_code,
        country,
      })
      .returning('address_id')

    const deliveryInfoToInsert = {
      customer_id: userId,
      address_id: address.address_id,
      recipient_full_name,
      phone_number,
      delivery_instructions,
    }
    const result = await trx('delivery_info')
      .insert(deliveryInfoToInsert)
      .returning(['delivery_info_id', 'created_at', 'updated_at'])

    await trx.commit()
    return result
  } catch (error) {
    await trx.rollback()
    throw new InternalServerError(error.toString())
  }
}

/*
 * @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieves all the delivery info for a customer
 * Checks:
 * 1. If the customer account exists
 */

const getAllQuery = async ({
  userId,
}: QueryParams): Promise<Knex.QueryBuilder<DeliveryInfo[]>> => {
  if (!userId)
    throw new UnauthorizedError('Sign-in to access delivery information.')
  // check if customer account is enabled
  const result = await knex('profiles')
    .where('id', userId)
    .select('is_customer')
    .limit(1)
  if (!result[0]?.is_customer)
    throw new ForbiddenError(
      'Profile is not a customer. Only customers can view delivery addresses.',
    )
  return knex<DeliveryInfo>('delivery_info')
    .join('address', 'delivery_info.address_id', 'address.address_id')
    .where('delivery_info.customer_id', userId)
    .select(
      'delivery_info.delivery_info_id',
      'delivery_info.recipient_full_name',
      'delivery_info.phone_number',
      'delivery_info.delivery_instructions',
      'address.address_id',
      'address.address_line_1',
      'address.address_line_2',
      'address.city',
      'address.state',
      'address.zip_postal_code',
      'address.country',
      'delivery_info.created_at',
      'delivery_info.updated_at',
    )
}

/* @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieves a single delivery info for a customer
 * Checks:
 * 1. If the customer account exists
 */

const getQuery = async ({
  params,
  userId,
}: QueryParams): Promise<Knex.QueryBuilder<DeliveryInfo[]>> => {
  if (!userId)
    throw new UnauthorizedError('Signin to access delivery information.')
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { deliveryInfoId } = params
  // check if customer account is enabled
  const result = await knex('profiles')
    .where('id', userId)
    .select('is_customer')
    .limit(1)
  if (!result[0]?.is_customer)
    throw new ForbiddenError(
      'Profile is not a customer. Only customers can view delivery addresses.',
    )
  return knex<DeliveryInfo>('delivery_info')
    .join('address', 'delivery_info.address_id', 'address.address_id')
    .where('delivery_info.delivery_info_id', deliveryInfoId)
    .where('delivery_info.customer_id', userId)
    .select(
      'delivery_info.delivery_info_id',
      'delivery_info.recipient_full_name',
      'delivery_info.phone_number',
      'delivery_info.delivery_instructions',
      'address.address_id',
      'address.address_line_1',
      'address.address_line_2',
      'address.city',
      'address.state',
      'address.zip_postal_code',
      'address.country',
      'delivery_info.created_at',
      'delivery_info.updated_at',
    )
}

/* @param {QueryParams} qp
 * @returns {Promise<number>}
 * @description Updates delivery info for the customer
 * Checks:
 * 1. If the customer owns the delivery info
 * 2. If the delivery info ID is provided
 * 3. If the customer exists
 */

const updateQuery = async ({
  params,
  body,
  userId,
}: QueryParams): Promise<Knex.QueryBuilder<DeliveryInfo> | any[]> => {
  if (!userId)
    throw new UnauthorizedError('Signin to access delivery information.')
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { deliveryInfoId } = params
  if (!isValidDeliveryInfoRequest(body))
    throw new BadRequestError('Invalid data')
  const deliveryData: DeliveryInfo = body
  if (!deliveryInfoId)
    throw new BadRequestError('Need delivery-info ID to update resource')
  // check if customer account is enabled
  const result = await knex('profiles')
    .where('id', userId)
    .select('is_customer')
    .limit(1)
  if (!result[0]?.is_customer)
    throw new ForbiddenError(
      'Profile is not a customer. Only customers can view delivery addresses.',
    )
  const {
    delivery_instructions,
    recipient_full_name,
    phone_number,
    address_line_1,
    address_line_2,
    city,
    state,
    zip_postal_code,
    country,
  } = deliveryData

  const deliveryInfoUpdate: Partial<DeliveryInfo> = {}
  if (delivery_instructions !== undefined)
    deliveryInfoUpdate.delivery_instructions = delivery_instructions
  if (recipient_full_name !== undefined)
    deliveryInfoUpdate.recipient_full_name = recipient_full_name
  if (phone_number !== undefined) deliveryInfoUpdate.phone_number = phone_number

  const addressUpdate: Partial<DeliveryInfo> = {}
  if (address_line_1 !== undefined)
    addressUpdate.address_line_1 = address_line_1
  if (address_line_2 !== undefined)
    addressUpdate.address_line_2 = address_line_2
  if (city !== undefined) addressUpdate.city = city
  if (state !== undefined) addressUpdate.state = state
  if (zip_postal_code !== undefined)
    addressUpdate.zip_postal_code = zip_postal_code
  if (country !== undefined) addressUpdate.country = country

  // Start a transaction
  const trx = await knex.transaction()

  try {
    // Get the address_id associated with the delivery_info
    const [currentDeliveryInfo] = await trx('delivery_info')
      .where('delivery_info_id', deliveryInfoId)
      .where('customer_id', userId)
      .select('address_id')

    if (!currentDeliveryInfo) {
      throw new BadRequestError('Delivery info for customer not found')
    }

    const { address_id } = currentDeliveryInfo

    let updatedDeliveryInfo: DeliveryInfo | undefined
    if (Object.keys(deliveryInfoUpdate).length > 0) {
      ;[updatedDeliveryInfo] = await trx('delivery_info')
        .where('delivery_info_id', deliveryInfoId)
        .where('customer_id', userId)
        .update(deliveryInfoUpdate)
        .returning('*')
    } else {
      ;[updatedDeliveryInfo] = await trx('delivery_info')
        .where('delivery_info_id', deliveryInfoId)
        .where('customer_id', userId)
        .select('*')
    }

    let updatedAddress: DeliveryInfo | undefined
    if (Object.keys(addressUpdate).length > 0) {
      ;[updatedAddress] = await trx('address')
        .where('address_id', address_id)
        .update(addressUpdate)
        .returning('*')
    } else {
      ;[updatedAddress] = await trx('address')
        .where('address_id', address_id)
        .select('*')
    }

    await trx.commit()

    const latestUpdatedAt =
      updatedDeliveryInfo && updatedAddress
        ? new Date(
            Math.max(
              updatedDeliveryInfo.updated_at?.getTime() || 0,
              updatedAddress.updated_at?.getTime() || 0,
            ),
          )
        : undefined

    const earliestCreatedAt =
      updatedDeliveryInfo && updatedAddress
        ? new Date(
            Math.min(
              updatedDeliveryInfo.created_at?.getTime() || Infinity,
              updatedAddress.created_at?.getTime() || Infinity,
            ),
          )
        : undefined

    return [
      {
        delivery_info_id: deliveryInfoId,
        created_at: earliestCreatedAt,
        updated_at: latestUpdatedAt,
      },
    ]
  } catch (error) {
    await trx.rollback()
    throw new InternalServerError(error.toString())
  }
}

/* @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Deletes a delivery info for the customer
 * Checks:
 * 1. If Id is provided
 * 2. If Customer account exists
 * 3. If Customer owns the delivery info
 */

const deleteQuery = async ({
  params,
  userId,
}: QueryParams): Promise<Knex.QueryBuilder<string>> => {
  if (!userId)
    throw new UnauthorizedError('Signin to delete delivery information.')
  if (params == null) throw new BadRequestError('No route parameters provided')
  const { deliveryInfoId } = params
  if (!deliveryInfoId)
    throw new BadRequestError('Need Id param to delete resource')
  // check if customer account is enabled
  const result = await knex('profiles')
    .where('id', userId)
    .select('is_customer')
    .limit(1)
  if (!result[0]?.is_customer)
    throw new ForbiddenError(
      'Profile is not a customer. Only customers can delete delivery addresses.',
    )
  return knex<DeliveryInfo>('delivery_info')
    .where('delivery_info_id', deliveryInfoId)
    .where('customer_id', userId)
    .del()
    .returning([
      'delivery_info_id',
      'created_at',
      'updated_at',
      knex.raw('NOW() as deleted_at'),
    ])
}

const { CREATED, OK } = StatusCodes

const processPostRoute = <ProcessRoute>processRoute
const createDeliveryInfo = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateBody: validateReqData(DeliveryInfoRequestSchema),
  validateResult: validateResData(DeliveryInfoSchemaID),
})

const processGetAllRoute = <ProcessRouteWithoutBody>processRoute
const getAllDeliveryInfo = processGetAllRoute({
  Query: getAllQuery,
  status: OK,
  validateResult: validateResData(DeliveryInfoResponseListSchema),
})

const processGetRoute = <ProcessRouteWithoutBody>processRoute
const getDeliveryInfo = processGetRoute({
  Query: getQuery,
  status: OK,
  validateResult: validateResData(DeliveryInfoResponseSchema),
})

const processPutRoute = <ProcessRoute>processRoute
const updateDeliveryInfo = processPutRoute({
  Query: updateQuery,
  status: OK,
  validateBody: validateReqData(DeliveryInfoRequestSchema),
  validateResult: validateResData(DeliveryInfoSchemaID),
})

const processDeleteRoute = <ProcessRouteWithoutBody>processRoute
const deleteDeliveryInfo = processDeleteRoute({
  Query: deleteQuery,
  status: OK,
  validateResult: validateResData(DeliveryInfoSchemaID),
})

export {
  createDeliveryInfo,
  getDeliveryInfo,
  getAllDeliveryInfo,
  updateDeliveryInfo,
  deleteDeliveryInfo,
}
