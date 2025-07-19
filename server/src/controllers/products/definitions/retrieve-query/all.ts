import { QueryResult, QueryResultRow } from 'pg'
import { pg } from '../../../../db/index.js'
import { QueryParams } from '../../../../types/process-routes.js'
import { handleSortQuery } from './utility.js'

/**
 * @param {QueryParams} {query}
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve all products
 */
export default async ({
  query,
}: QueryParams): Promise<QueryResult<QueryResultRow>> => {
  const { userId, storeId, limit, sort, offset } = query
  let params: (string | undefined)[] = []
  let whereClause = ''
  let paramIndex = 1

  if (userId && storeId) {
    whereClause = `WHERE p.vendor_id=$${paramIndex} AND p.store_id=$${paramIndex + 1}`
    params.push(<string>userId, <string>storeId)
  } else if (userId) {
    whereClause = `WHERE p.vendor_id=$${paramIndex}`
    params.push(<string>userId)
  } else if (storeId) {
    whereClause = `WHERE p.store_id=$${paramIndex}`
    params.push(<string>storeId)
  }

  let dbQueryString = `
		WITH product_data AS (
			SELECT
				p.*,
				(SELECT JSON_AGG(media_data) FROM
					(SELECT pm.*
							 FROM product_media pm
							 WHERE pm.product_id=p.product_id)
							AS media_data) AS media,
				c.category_name,
				s.subcategory_name,
				AVG(pr.rating) AS average_rating,
				COUNT(pr.rating) AS review_count
			FROM products p
			JOIN categories c USING (category_id)
			JOIN subcategories s USING (subcategory_id)
			JOIN order_items oi ON p.product_id = oi.product_id
			JOIN product_reviews pr ON oi.order_item_id = pr.order_item_id
			GROUP BY
				p.product_id, p.title, p.description, p.list_price, p.net_price, p.quantity_available, p.created_at, p.updated_at, p.store_id, p.category_id, p.subcategory_id,
				c.category_name, s.subcategory_name
			${whereClause}
			${sort ? `${handleSortQuery(<string>sort)}` : ''}
			${limit ? `LIMIT ${limit}` : ''}
			${offset ? `OFFSET ${offset}` : ''})

SELECT JSON_AGG(product_data) AS products,
	(SELECT COUNT(*) FROM product_data) AS total_products FROM product_data;`
  return pg.query(dbQueryString, params)
}
