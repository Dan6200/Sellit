import chai from 'chai'
import { stores } from '../data/users/user-aliyu/index.js'

export async function createStoreForTesting(token: string) {
  return chai
    .request(process.env.SERVER!)
    .post('/v1/stores')
    .auth(token, { type: 'bearer' })
    .send(stores[0])
}
