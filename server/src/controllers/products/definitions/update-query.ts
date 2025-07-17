//cspell:ignore jsonb
import { knex } from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import { QueryParams } from '../../../types/process-routes.js'
import {
  isValidProductRequestData,
  ProductResponseData,
} from '../../../types/products.js'
import ForbiddenError from '#src/errors/forbidden.js'
import UnauthorizedError from '#src/errors/unauthorized.js'

/* @param {QueryParams} {params, query, body, userId}
 * @returns {Promise<ProductResponseData[]>}
 * @description Update a product
 */
export default async ({
  params,
  body,
  userId,
  query,
}: QueryParams): Promise<ProductResponseData[]> => {
  if (!userId) {
    throw new UnauthorizedError('Sign-in to update product.')
  }
  if (params == null) throw new BadRequestError('Must provide product id')
  const { productId } = params
  const { store_id: storeId } = query
  // check if vendor account is enabled
  const response = await knex('users')
    .where('user_id', userId)
    .first('is_vendor')
  if (!response?.is_vendor)
    throw new ForbiddenError(
      'Profile is not a vendor. Need to enable your vendor account for this operation.',
    )
  if (!storeId)
    throw new BadRequestError('Need to provide Store ID as query param')
  const storeQRes = await knex('stores')
    .where('vendor_id', userId)
    .where('store_id', storeId)
    .first('vendor_id')

  if (!storeQRes?.vendor_id)
    throw new ForbiddenError('Must have a store to be able to update products')

  if (!isValidProductRequestData(body))
    throw new BadRequestError('Invalid product data')

  const productData = body

  const dBFriendlyProductData = {
    ...body,
    description: knex.raw('ARRAY[?]::text[]', [productData.description]),
  }

  return knex('products')
    .where('product_id', productId)
    .where('store_id', storeId)
    .where('vendor_id', userId)
    .update(dBFriendlyProductData)
    .returning('*')
}
