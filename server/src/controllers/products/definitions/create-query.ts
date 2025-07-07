//cspell:ignore jsonb
import { knex } from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import { QueryParams } from '../../../types/process-routes.js'
import { isValidProductRequestData } from '../../../types/products.js'

/**
 * @param {QueryParams} {body, query, userId}
 * @returns {Promise<number>} - The database response
 * @description Create a new product
 */
export default async ({
  body,
  userId: vendorId,
  params: { storeId },
  // query: {
}: QueryParams): Promise<number> => {
  let response = await knex('vendors')
    .where('vendor_id', vendorId)
    .first('vendor_id')
  if (response.length === 0) {
    throw new BadRequestError(
      'Must have a Vendor account to be able to list products',
    )
  }
  response = await knex('stores')
    .where('vendor_id', vendorId)
    .where('store_id', storeId)
    .first('vendor_id')
  if (response.length === 0) {
    throw new BadRequestError('Must create a store to be able to list products')
  }

  if (!isValidProductRequestData(body))
    throw new BadRequestError('Invalid product data')

  const productData = body

  const DBFriendlyProductData = {
    ...productData,
    description: JSON.stringify(productData.description),
  }

  return knex('products')
    .insert({
      ...DBFriendlyProductData,
      vendor_id: vendorId,
      store_id: storeId,
    })
    .returning('product_id')
}
