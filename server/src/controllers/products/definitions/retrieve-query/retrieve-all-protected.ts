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
export default async ({
  query,
}: QueryParams): Promise<QueryResult<QueryResultRow>> => {
  const { sort, limit, offset, userId, storeId } = query
  let response
  if (userId) {
    response = await knex('products')
      .where('vendor_id', userId)
      .first('product_id')
    if (!response.length)
      throw new BadRequestError('No products associated with this user.')
  }
  if (storeId) {
    response = await knex('products')
      .where('store_id', storeId)
      .first('product_id')
    if (!response.length)
      throw new BadRequestError('No products associated with this store.')
  }
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
				${userId && storeId ? `WHERE p.vendor_id=$1 AND p.store_id=$2` : userId ? `WHERE p.vendor_id=$1` : storeId ? `WHERE p.store_id=$1` : ''})

SELECT JSON_AGG(product_data) AS products, 
	(SELECT COUNT(*) FROM products) AS total_products FROM product_data;`
  return pg.query(dbQueryString, [userId, storeId])
}
