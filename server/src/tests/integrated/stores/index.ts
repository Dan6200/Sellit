import StoreData from '@/types/store-data.js'
import {
  testCreateStore,
  testGetStore,
  testUpdateStore,
  testGetAllStores,
  testDeleteStore,
  testGetNonExistentStore,
} from '../stores/definitions/index.js'
import assert from 'assert'
import { UserRequestData } from '../../../types/users/index.js'
import { deleteAllUsersForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import { testHasVendorAccount } from '../users/definitions.js'

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
    token = await signInForTesting(userInfo)
  })
  const path = '/v1/stores'

  let storeIds: string[] = []

  it("should have a vendor's account", () =>
    testHasVendorAccount({
      server,
      path: '/v1/users',
      token,
    }))

  it('should create a store for the vendor', async () => {
    // Create stores using store information
    assert(!!stores.length)
    for (const store of stores) {
      const { store_id } = await testCreateStore({
        server,
        token,
        path,
        requestBody: store,
      })
      storeIds.push(store_id)
    }
  })

  it('it should fetch all the stores with one request', async () => {
    await testGetAllStores({ server, token, path })
  })

  it('it should fetch all the stores with a loop', async () => {
    assert(!!storeIds.length)
    for (const storeId of storeIds) {
      await testGetStore({ server, token, path: `${path}/${storeId}` })
    }
  })

  it('should update all the stores with a loop', async () => {
    assert(!!storeIds.length && storeIds.length === updatedStores.length)
    for (const [idx, storeId] of storeIds.entries()) {
      await testUpdateStore({
        server,
        token,
        path: path + '/' + storeId,
        requestBody: updatedStores[idx],
      })
    }
  })

  it('should delete all the stores with a loop', async () => {
    assert(!!storeIds.length)
    for (const storeId of storeIds) {
      await testDeleteStore({ server, token, path: path + '/' + storeId })
    }
  })

  it('should fail to retrieve any store', async () => {
    assert(!!storeIds.length)
    for (const storeId of storeIds) {
      await testGetNonExistentStore({
        server,
        token,
        path: path + '/' + storeId,
      })
    }
  })
}
