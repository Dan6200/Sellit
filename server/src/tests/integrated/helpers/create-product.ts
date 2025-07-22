import chai from 'chai'
import { products } from '../data/users/vendors/user-aliyu/products/index.js'

export async function createProductsForTesting(
  token: string,
  store_id: string,
) {
  return chai
    .request(process.env.SERVER!)
    .post('/v1/products')
    .auth(token, { type: 'bearer' })
    .query({ store_id })
    .send(products[0])
}
