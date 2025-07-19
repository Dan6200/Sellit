import StoreData from '#src/types/store-data.js'
import {
  testCreateStoreWithoutVendorAccount,
  testUpdateStoreWithoutVendorAccount,
  testDeleteStoreWithoutVendorAccount,
} from '../stores/definitions/index.js'
import assert from 'assert'
import { ProfileRequestData } from '../../../types/profile/index.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import { knex } from '#src/db/index.js'

export default function ({
  userInfo,
  stores,
  updatedStores,
}: {
  userInfo: ProfileRequestData
  stores: StoreData[]
  updatedStores: StoreData[]
}) {
  const server = process.env.SERVER!
  let token: string
  let userId: string
  before(async () => {
    userId = await createUserForTesting(userInfo)
    token = await signInForTesting(userInfo)
  })
  const path = '/v1/stores'

  beforeEach(async () => {
    // important to move to before each because the supabase create user is interfering and causing race conditions
    await knex('profiles')
      .update('is_vendor', false)
      .where({ email: userInfo.email })
      .returning('*')
  })

  let storeIds: string[] = []
  it('should fail to create a store when no vendor account exists', async () => {
    assert(!!stores.length)
    for (const store of stores) {
      const { store_id } = await testCreateStoreWithoutVendorAccount({
        server,
        token,
        path,
        requestBody: store,
      })
      storeIds.push(store_id)
    }
  })

  it('should fail to update stores when no vendor account exists', async () => {
    assert(!!storeIds.length && storeIds.length === updatedStores.length)
    for (const [idx, storeId] of storeIds.entries()) {
      await testUpdateStoreWithoutVendorAccount({
        server,
        token,
        path: path + '/' + storeId,
        requestBody: updatedStores[idx],
      })
    }
  })

  it('should fail to delete stores when no vendor account exists', async () => {
    assert(!!storeIds.length)
    for (const storeId of storeIds) {
      await testDeleteStoreWithoutVendorAccount({
        server,
        token,
        path: path + '/' + storeId,
      })
    }
  })
  after(async () => {
    await deleteUserForTesting(userId)
  })
}
