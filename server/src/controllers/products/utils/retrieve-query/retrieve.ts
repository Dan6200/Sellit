import { QueryResult, QueryResultRow } from 'pg'
import { pg } from '../../../../db/index.js'
import BadRequestError from '../../../../errors/bad-request.js'
import { QueryParams } from '../../../../types/process-routes.js'
import getQueryProtected from './retrieve-protected.js'

/**
 * @param {QueryParams} qp
 * @returns {Promise<QueryResult<QueryResultRow>>}
 * @description Retrieve a product
 **/
export default async <T>(
  qp: QueryParams<T>,
): Promise<QueryResult<QueryResultRow>> => {
  // if route is protected, use getQueryProtected
  if (!qp.query?.public) {
    return getQueryProtected(qp)
  }
  const { params } = qp
  if (params == null) throw new BadRequestError('Must provide a product id')
  const { productId } = params
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
			WHERE p.product_id=$1;`,
    [productId],
  )
}
