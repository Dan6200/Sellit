import ShippingInfo from '@/types-and-interfaces/shipping-info.js'
import { supabase } from '#supabase-config'
import { testPostCustomer } from '../users/customers/utils/index.js'
import {
  testCreateShipping,
  testGetShipping,
  testUpdateShipping,
  testDeleteShipping,
  testGetNonExistentShipping,
} from '../shipping-info/utils/index.js'
import assert from 'assert'
import { knex } from '../../../db/index.js'
import { UserRequestData } from '../../../types-and-interfaces/users/index.js'

// Set server url
const server = process.env.SERVER!

export default function ({
  userInfo,
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
}: {
  userInfo: UserRequestData
  listOfShippingInfo: ShippingInfo[]
  listOfUpdatedShippingInfo: ShippingInfo[]
}) {
  before(async () => {
    await testPostCustomer({ server, path: '/v1/users/customers' })
  })

  after(async function () {
    // Delete users from db
    if (userIdToDelete)
      await knex('users').where('userId', userIdToDelete).del()
    // Delete all users from firebase auth
    await supabase.auth.admin
      .deleteUser(userIdToDelete)
      .catch((error: Error) =>
        console.error(
          `failed to delete user with userId ${userIdToDelete}: ${error}`,
        ),
      )
  })

  const shippingPath = '/v1/shipping-info'
  let userIdToDelete = ''

  const shippingIds: number[] = []

  it(`it should add multiple shipping addresses for the customer`, async () => {
    for (const shippingInfo of listOfShippingInfo) {
      const { shipping_info_id } = await testCreateShipping({
        server,
        path: shippingPath,
        body: shippingInfo,
      })
      shippingIds.push(shipping_info_id)
    }
  })

  it('it should retrieve all shipping information through a loop', async () => {
    for (const shippingId of shippingIds) {
      await testGetShipping({
        server,
        path: shippingPath + '/' + shippingId,
      })
    }
  })

  it(`it should update all shipping addresses for the customer`, async () => {
    assert(shippingIds.length === listOfUpdatedShippingInfo.length)
    for (const [idx, shippingId] of shippingIds.entries()) {
      await testUpdateShipping({
        server,
        path: shippingPath + '/' + shippingId,
        body: listOfUpdatedShippingInfo[idx],
      })
    }
  })

  it(`it should delete all shipping addresses for the customer`, async () => {
    for (const shippingId of shippingIds) {
      await testDeleteShipping({
        server,
        path: shippingPath + '/' + shippingId,
      })
    }
  })

  it(`it should fail to retrieve any of the deleted shipping information`, async () => {
    for (const shippingId of shippingIds) {
      await testGetNonExistentShipping({
        server,
        path: `${shippingPath}/${shippingId}`,
      })
    }
  })
}
