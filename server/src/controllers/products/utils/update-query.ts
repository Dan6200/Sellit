//cspell:ignore jsonb
import { QueryResult, QueryResultRow } from 'pg'
import { knex } from '../../../db/index.js'
import BadRequestError from '../../../errors/bad-request.js'
import { QueryParams } from '../../../types/process-routes.js'
import {
  isValidProductRequestData,
  ProductRequestData,
  ProductResponseData,
} from '../../../types/products.js'

/* @param {QueryParams} {params, query, body, userId}
 * @returns {Promise<number>}
 * @description Update a product
 */
export default async <T>({
  params,
  body,
  userId: vendorId,
}: QueryParams<T>): Promise<number> => {
  if (params == null) throw new BadRequestError('Must provide a product id')

  const { productId } = params

  const response = await knex('vendors')
    .where('vendor_id', vendorId)
    .first('vendor_id')
  if (response.length)
    throw new BadRequestError(
      'Must have a vendor account to be able to update product list',
    )

  if (!isValidProductRequestData(body))
    throw new BadRequestError('Invalid product data')

  const DBFriendlyProductData: Omit<ProductRequestData, 'description'> & {
    description: string
  } = {
    ...body,
    description: JSON.stringify(body.description),
  }

  return knex<ProductResponseData>('products')
    .where('product_id', productId)
    .andWhere('vendor_id', vendorId)
    .update(DBFriendlyProductData)
    .returning('product_id')
}
