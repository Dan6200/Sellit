import { QueryResult, QueryResultRow } from 'pg'
import { knex, pg } from '../../../../db/index.js'
import BadRequestError from '../../../../errors/bad-request.js'
import { QueryParams } from '../../../../types/process-routes.js'

/**
 * @param {QueryParams} {params, query, userId}
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
  let whereClause = 'WHERE p.product_id=$1 '
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
  const response = await knex('vendors')
    .where('vendor_id', userId)
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
			${whereClause}`,
    sqlParams,
  )
}
