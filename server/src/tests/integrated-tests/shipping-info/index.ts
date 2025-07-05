import ShippingInfo from '@/types-and-interfaces/shipping-info.js'
import { testPostCustomer } from '../users/customers/definitions/index.js'
import {
  testCreateShipping,
  testGetShipping,
  testUpdateShipping,
  testDeleteShipping,
  testGetNonExistentShipping,
} from '../shipping-info/utils/index.js'
import assert from 'assert'
import { UserRequestData } from '../../../types-and-interfaces/users/index.js'
import { deleteAllUsersForTesting } from '../test-route/delete-user.js'
import { createUserForTesting } from '../test-route/create-user.js'

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
  const { email, password } = userInfo
  before(async () => {
    // Delete all users from Supabase auth
    await deleteAllUsersForTesting()
    // Create user after...
    await createUserForTesting(userInfo)
    await testPostCustomer({
      server,
      requestBody: { email, password },
      path: '/v1/users/customers',
    })
  })

  const shippingPath = '/v1/shipping-info'

  const shippingIds: number[] = []

  it(`it should add multiple shipping addresses for the customer`, async () => {
    for (const shippingInfo of listOfShippingInfo) {
      const { shipping_info_id } = await testCreateShipping({
        server,
        path: shippingPath,
        requestBody: { ...shippingInfo, email, password },
      })
      shippingIds.push(shipping_info_id)
    }
  })

  it('it should retrieve all shipping information through a loop', async () => {
    for (const shippingId of shippingIds) {
      await testGetShipping({
        server,
        path: shippingPath + '/' + shippingId,
        requestBody: { email, password },
      })
    }
  })

  it(`it should update all shipping addresses for the customer`, async () => {
    assert(shippingIds.length === listOfUpdatedShippingInfo.length)
    for (const [idx, shippingId] of shippingIds.entries()) {
      await testUpdateShipping({
        server,
        path: shippingPath + '/' + shippingId,
        requestBody: { ...listOfUpdatedShippingInfo[idx], email, password },
      })
    }
  })

  it(`it should delete all shipping addresses for the customer`, async () => {
    for (const shippingId of shippingIds) {
      await testDeleteShipping({
        server,
        path: shippingPath + '/' + shippingId,
        requestBody: { email, password },
      })
    }
  })

  it(`it should fail to retrieve any of the deleted shipping information`, async () => {
    for (const shippingId of shippingIds) {
      await testGetNonExistentShipping({
        server,
        path: `${shippingPath}/${shippingId}`,
        requestBody: { email, password },
      })
    }
  })
}
