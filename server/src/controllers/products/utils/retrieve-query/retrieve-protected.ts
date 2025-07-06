import { QueryResult, QueryResultRow } from 'pg'
import { knex, pg } from '../../../../db/index.js'
import BadRequestError from '../../../../errors/bad-request.js'
import { QueryParams } from '../../../../types/process-routes.js'

/**
 * @param {QueryParams} {params, query, userId}
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve a product
 **/
export default async <T>({
  params,
  userId: vendorId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  if (params == null) throw new BadRequestError('Must provide a product id')
  const { productId } = params
  const response = await knex('vendors')
    .where('vendor_id', vendorId)
    .first('vendor_id')
  if (response.length)
    throw new BadRequestError(
      'Must have a Vendor account to be able to view product list',
    )
  return pg.query(
    `SELECT p.*, 
		(SELECT JSON_AGG(media_data) FROM
			(SELECT pm.*
					 FROM product_media pm 
					 WHERE pm.product_id=p.product_id)
					AS media_data) 
					AS media, c.category_name, s.subcategory_name
				FROM products p 
				JOIN categories c USING (category_id)
				JOIN subcategories s USING (subcategory_id)
			WHERE p.product_id=$1 AND p.vendor_id=$2`,
    [productId, vendorId],
  )
}
