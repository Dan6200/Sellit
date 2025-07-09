//cspell:ignore jsonb
import ForbiddenError from '@/errors/forbidden.js'
import { knex } from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import { QueryParams } from '../../../types/process-routes.js'
import {
  DBFriendlyProductData,
  isValidProductRequestData,
} from '../../../types/products.js'

/**
 * @param {QueryParams} {body, query, userId}
 * @returns {Promise<number>} - The database response
 * @description Create a new product
 */
export default async ({
  body,
  userId,
  query: { storeId },
}: QueryParams): Promise<number> => {
  // check if vendor account is enabled
  const result = await knex('users')
    .where('user_id', userId)
    .select('is_vendor')
    .limit(1)
  if (!result[0]?.is_vendor)
    throw new ForbiddenError(
      'Vendor account disabled. Need to enable it to create a store',
    )
  if (!storeId)
    throw new BadRequestError(
      'Need to provide Store ID as query param in order to list a product',
    )
  const response = await knex('stores')
    .where('vendor_id', userId)
    .where('store_id', storeId)
    .first('vendor_id')

  if (!response.length || !result[0]?.vendor_id)
    throw new ForbiddenError('Must create a store to be able to list products')

  if (!isValidProductRequestData(body))
    throw new BadRequestError('Invalid product data')

  const productData = body

  const dBFriendlyProductData = {
    ...productData,
    description: JSON.stringify(productData.description),
  }

  return knex<DBFriendlyProductData & { vendor_id: string; store_id: string }>(
    'products',
  )
    .insert({
      ...dBFriendlyProductData,
      vendor_id: userId,
      store_id: storeId as string,
    })
    .returning('product_id')
}
