import StoreData from '@/types/store-data.js'
import {
  testCreateStoreWithoutVendorAccount,
  testGetStoreWithoutVendorAccount,
  testUpdateStoreWithoutVendorAccount,
  testGetAllStoresWithoutVendorAccount,
  testDeleteStoreWithoutVendorAccount,
} from '../stores/definitions/index.js'
import assert from 'assert'
import { UserRequestData } from '../../../types/users/index.js'
import { deleteAllUsersForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import { knex } from '@/db/index.js'

export default function ({
  userInfo,
  stores,
  updatedStores,
}: {
  userInfo: UserRequestData
  stores: StoreData[]
  updatedStores: StoreData[]
}) {
  const server = process.env.SERVER!
  let token: string
  before(async () => {
    // Delete all users from Supabase auth
    await deleteAllUsersForTesting()
    // Create user after...
    await createUserForTesting(userInfo)
    const response = await knex('users')
      .update('is_vendor', false)
      .where({ email: userInfo.email })
      .returning('*')
    process.env.DEBUG &&
      console.log('\nDEBUG: Updated User role -> ' + JSON.stringify(response))
    token = await signInForTesting(userInfo)
  })
  const path = '/v1/stores'

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

  it('should fail to fetch all stores when no vendor account exists', async () => {
    await testGetAllStoresWithoutVendorAccount({ server, token, path })
  })

  it('should fail to fetch individual stores when no vendor account exists', async () => {
    assert(!!storeIds.length)
    for (const storeId of storeIds) {
      await testGetStoreWithoutVendorAccount({
        server,
        token,
        path: `${path}/${storeId}`,
      })
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
}
