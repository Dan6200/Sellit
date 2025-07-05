//cspell:ignore jsonb
import { knex } from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import { QueryParams } from '../../../types-and-interfaces/process-routes.js'
import { isValidProductRequestData } from '../../../types-and-interfaces/products.js'

/**
 * @param {QueryParams} {body, query, userId}
 * @returns {Promise<number>} - The database response
 * @description Create a new product
 */
export default async <T>({
  body,
  userId: vendorId,
}: QueryParams<T>): Promise<number> => {
  const response = await knex('vendors')
    .where('vendor_id', vendorId)
    .first('vendor_id')
  if (response.length === 0) {
    throw new BadRequestError(
      'Must have a Vendor account to be able to list products',
    )
  }

  if (!isValidProductRequestData(body))
    throw new BadRequestError('Invalid product data')

  const productData = body

  const DBFriendlyProductData = {
    ...productData,
    description: JSON.stringify(productData.description),
  }

  return knex('products')
    .insert({ ...DBFriendlyProductData, vendor_id: vendorId })
    .returning('product_id')
}
