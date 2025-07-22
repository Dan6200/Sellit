import chai from 'chai'
import { listOfStores } from '../data/users/vendors/user-aliyu/index.js'

export async function createStoreForTesting(token: string) {
  return chai
    .request(process.env.SERVER!)
    .post('/v1/stores')
    .auth(token, { type: 'bearer' })
    .send(listOfStores[0])
}
