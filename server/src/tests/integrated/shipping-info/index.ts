import ShippingInfo from '@/types/shipping-info.js'
import {
  testCreateShipping,
  testGetShipping,
  testUpdateShipping,
  testDeleteShipping,
  testGetNonExistentShipping,
} from '../shipping-info/definitions/index.js'
import assert from 'assert'
import { UserRequestData } from '../../../types/users/index.js'
import { deleteAllUsersForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'
import { createCustomerForTesting } from '../helpers/create-customer.js'
import { signInForTesting } from '../helpers/signin-user.js'

export default function ({
  userInfo,
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
}: {
  userInfo: UserRequestData
  listOfShippingInfo: ShippingInfo[]
  listOfUpdatedShippingInfo: ShippingInfo[]
}) {
  const server = process.env.SERVER!
  let token: string
  before(async () => {
    // Delete all users from Supabase auth
    await deleteAllUsersForTesting()
    // Create user after...
    await createUserForTesting(userInfo)
    token = await signInForTesting(userInfo)
    await createCustomerForTesting(token)
  })

  const shippingPath = '/v1/shipping-info'

  const shippingIds: number[] = []

  it(`it should add multiple shipping addresses for the customer`, async () => {
    for (const shippingInfo of listOfShippingInfo) {
      const { shipping_info_id } = await testCreateShipping({
        server,
        path: shippingPath,
        requestBody: { ...shippingInfo },
        token,
      })
      shippingIds.push(shipping_info_id)
    }
  })

  it('it should retrieve all shipping information through a loop', async () => {
    for (const shippingId of shippingIds) {
      await testGetShipping({
        server,
        path: shippingPath + '/' + shippingId,
        token,
      })
    }
  })

  it(`it should update all shipping addresses for the customer`, async () => {
    assert(shippingIds.length === listOfUpdatedShippingInfo.length)
    for (const [idx, shippingId] of shippingIds.entries()) {
      await testUpdateShipping({
        server,
        path: shippingPath + '/' + shippingId,
        requestBody: { ...listOfUpdatedShippingInfo[idx] },
        token,
      })
    }
  })

  it(`it should delete all shipping addresses for the customer`, async () => {
    for (const shippingId of shippingIds) {
      await testDeleteShipping({
        server,
        path: shippingPath + '/' + shippingId,
        token,
      })
    }
  })

  it(`it should fail to retrieve any of the deleted shipping information`, async () => {
    for (const shippingId of shippingIds) {
      await testGetNonExistentShipping({
        server,
        path: `${shippingPath}/${shippingId}`,
        token,
      })
    }
  })
}
