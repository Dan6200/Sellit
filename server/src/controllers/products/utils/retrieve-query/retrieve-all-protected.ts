import { QueryResult, QueryResultRow } from 'pg'
import { pg, knex } from '../../../../db/index.js'
import BadRequestError from '../../../../errors/bad-request.js'
import { QueryParams } from '../../../../types/process-routes.js'
import { handleSortQuery } from './utility.js'

/**
 * @param {QueryParams} {query, userId}
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve all products
 */
export default async <T>({
  query,
  userId: vendorId,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  const { sort, limit, offset } = query
  const response = await knex('vendors')
    .where('vendor_id', vendorId)
    .first('vendor_id')
  if (response.length)
    throw new BadRequestError(
      'Must have a Vendor account to be able to view products',
    )
  let dbQueryString = `
	WITH product_data AS (
	 SELECT p.*, 
		(SELECT JSON_AGG(media_data) FROM
			(SELECT pm.*
					 FROM product_media pm 
					 WHERE pm.product_id=p.product_id)
					AS media_data) 
					AS media, c.category_name, s.subcategory_name
				FROM products p 
				JOIN categories c USING (category_id)
				JOIN subcategories s USING (subcategory_id)
				WHERE p.vendor_id=$1
			${sort ? `${handleSortQuery(<string>sort)}` : ''}
			${limit ? `LIMIT ${limit}` : ''}
			${offset ? `OFFSET ${offset}` : ''})

SELECT JSON_AGG(product_data) AS products, 
	(SELECT COUNT(*) FROM products) AS total_products FROM product_data;`
  return pg.query(dbQueryString, [vendorId])
}
