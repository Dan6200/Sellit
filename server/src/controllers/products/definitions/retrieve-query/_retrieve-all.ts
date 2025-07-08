import { QueryResult, QueryResultRow } from 'pg'
import { pg, knex } from '../../../../db/index.js'
import BadRequestError from '../../../../errors/bad-request.js'
import { QueryParams } from '../../../../types/process-routes.js'
import { handleSortQuery } from './utility.js'
import getAllQueryProtected from './retrieve-all-protected.js'

/**
 * @description Retrieve all products
 *
 **/
export const getAllQuery = async <T>(
  qp: QueryParams<T>,
): Promise<QueryResult<QueryResultRow>> => {
  // if route is protected, use getAllQueryProtected
  if (!qp.query?.public) {
    return getAllQueryProtected(qp)
  }
  const { query } = qp
  const { sort, limit, offset } = query
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
			${sort ? `${handleSortQuery(<string>sort)}` : ''}
			${limit ? `LIMIT ${limit}` : ''}
			${offset ? `OFFSET ${offset}` : ''})

SELECT JSON_AGG(product_data) AS products, 
(SELECT COUNT(*) FROM products) AS total_products FROM product_data;`
  return pg.query(dbQueryString)
}
