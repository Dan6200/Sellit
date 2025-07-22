import { QueryResult, QueryResultRow } from 'pg'
import { knex, pg } from '../../../../db/index.js'
import BadRequestError from '../../../../errors/bad-request.js'
import { QueryParams } from '../../../../types/process-routes.js'

/**
 * @param {QueryParams} { params, query }
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve a product
 **/
export default async ({
  params,
  query,
}: QueryParams): Promise<QueryResult<QueryResultRow>> => {
  if (!params?.productId)
    throw new BadRequestError('Must provide a product id as a parameter')
  const { productId } = params
  const { userId, storeId } = query
  let sqlParams: (string | undefined)[] = [productId]
  let whereClause = ' WHERE p.product_id=$1 '
  let paramIndex = 2

  if (userId && storeId) {
    whereClause += `AND p.vendor_id=$${paramIndex} AND p.store_id=$${paramIndex + 1}`
    sqlParams.push(<string>userId, <string>storeId)
  } else if (userId) {
    whereClause += `AND p.vendor_id=$${paramIndex}`
    sqlParams.push(<string>userId)
  } else if (storeId) {
    whereClause += `AND p.store_id=$${paramIndex}`
    sqlParams.push(<string>storeId)
  }
  return pg.query(
    `SELECT p.*, 
		(SELECT JSON_AGG(media_data) FROM
			(SELECT pm.*
					 FROM product_media pm 
					 WHERE pm.product_id=p.product_id)
					AS media_data) 
					AS media, c.category_name, s.subcategory_name,
				AVG(pr.rating) AS average_rating,
				COUNT(pr.rating) AS review_count,
				COUNT(oi.order_item_id) AS products_sold
			FROM products p
			JOIN categories c USING (category_id)
			JOIN subcategories s USING (subcategory_id)
			LEFT JOIN order_items oi ON p.product_id = oi.product_id
			LEFT JOIN product_reviews pr ON oi.order_item_id = pr.order_item_id
		 ${whereClause}
			GROUP BY 
				p.product_id, p.title, p.description, p.list_price, p.net_price, p.quantity_available, p.created_at, p.updated_at, p.store_id, p.category_id, p.subcategory_id,
				c.category_name, s.subcategory_name`,
    sqlParams,
  )
}
