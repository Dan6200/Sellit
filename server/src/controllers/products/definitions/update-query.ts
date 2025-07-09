//cspell:ignore jsonb
import { QueryResult, QueryResultRow } from 'pg'
import { knex } from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import { QueryParams } from '../../../types/process-routes.js'
import {
  DBFriendlyProductData,
  isValidProductRequestData,
  ProductRequestData,
  ProductResponseData,
} from '../../../types/products.js'
import ForbiddenError from '@/errors/forbidden.js'
import { Knex } from 'knex'

/* @param {QueryParams} {params, query, body, userId}
 * @returns {Promise<number>}
 * @description Update a product
 */
export default async ({
  params,
  body,
  userId,
  query,
}: QueryParams): Promise<Knex.QueryBuilder> => {
  if (params == null) throw new BadRequestError('Must provide product id')
  const { productId } = params
  const { storeId } = query
  // check if vendor account is enabled
  const response = await knex('users')
    .where('user_id', userId)
    .select('is_vendor')
    .limit(1)
  if (!response[0]?.is_vendor)
    throw new ForbiddenError(
      'User is not a vendor. Need to enable your vendor account for this operation.',
    )
  if (!storeId)
    throw new BadRequestError('Need to provide Store ID as query param')
  const storeQRes = await knex('stores')
    .where('vendor_id', userId)
    .where('store_id', storeId)
    .first('vendor_id')

  if (!storeQRes.length || !storeQRes[0]?.vendor_id)
    throw new ForbiddenError('Must have a store to be able to update products')

  if (!isValidProductRequestData(body))
    throw new BadRequestError('Invalid product data')

  const dBFriendlyProductData: Omit<ProductRequestData, 'description'> & {
    description: string
  } = {
    ...body,
    description: JSON.stringify(body.description),
  }

  return knex('products')
    .where('product_id', productId)
    .where('store_id', storeId)
    .where('vendor_id', userId)
    .update(dBFriendlyProductData)
    .returning('*')
}
