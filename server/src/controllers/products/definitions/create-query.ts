//cspell:ignore jsonb
import ForbiddenError from '#src/errors/forbidden.js'
import { knex } from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import { QueryParams } from '../../../types/process-routes.js'
import {
  isValidProductRequestData,
  ProductResponseData,
} from '../../../types/products.js'
import UnauthorizedError from '#src/errors/unauthorized.js'

/**
 * @param {QueryParams} {body, query, userId}
 * @returns {Promise<ProductResponseData[]>} - The database response
 * @description Create a new product
 */
export default async ({
  body,
  userId,
  query: { store_id: storeId },
}: QueryParams): Promise<ProductResponseData[]> => {
  if (!userId) {
    throw new UnauthorizedError('Sign-in to list product.')
  }

  // check if vendor account is enabled
  const result = await knex('profiles').where('id', userId).first('is_vendor')
  if (!result?.is_vendor)
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

  if (!response?.vendor_id)
    throw new ForbiddenError('Must create a store to be able to list products')

  if (!isValidProductRequestData(body))
    throw new BadRequestError('Invalid product data')

  const productData = body

  const dBFriendlyProductData = {
    ...productData,
    description: knex.raw('ARRAY[?]::text[]', [productData.description]), // TODO: test this
  }

  return knex('products')
    .insert({
      ...dBFriendlyProductData,
      vendor_id: userId,
      store_id: storeId as string,
    })
    .returning('*')
}
