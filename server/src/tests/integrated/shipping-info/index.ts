import ShippingInfo from '#src/types/shipping-info.js'
import {
  testCreateShipping,
  testGetShipping,
  testUpdateShipping,
  testDeleteShipping,
  testGetNonExistentShipping,
} from '../shipping-info/definitions/index.js'
import assert from 'assert'
import { ProfileRequestData } from '../../../types/profile/index.js'
import { deleteAllUsersForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import { testHasCustomerAccount } from '../profiles/definitions.js'

export default function ({
  userInfo,
  listOfShippingInfo,
  listOfUpdatedShippingInfo,
}: {
  userInfo: ProfileRequestData
  listOfShippingInfo: ShippingInfo[]
  listOfUpdatedShippingInfo: ShippingInfo[]
}) {
  const server = process.env.SERVER!
  let token: string
  before(async () => {
    await deleteAllUsersForTesting()
    await createUserForTesting(userInfo)
    token = await signInForTesting(userInfo)
  })

  const shippingPath = '/v1/shipping-info'

  const shippingIds: number[] = []

  it("should have a customer's account", () =>
    testHasCustomerAccount({
      server,
      path: '/v1/me',
      token,
    }))

  it(`it should add multiple shipping addresses for the customer`, async () => {
    assert(!!listOfShippingInfo.length)
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
    assert(!!shippingIds.length)
    for (const shippingId of shippingIds) {
      await testGetShipping({
        server,
        path: shippingPath + '/' + shippingId,
        token,
      })
    }
  })

  it(`it should update all shipping addresses for the customer`, async () => {
    assert(
      !!shippingIds.length &&
        shippingIds.length === listOfUpdatedShippingInfo.length,
    )
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
    assert(!!shippingIds.length)
    for (const shippingId of shippingIds) {
      await testDeleteShipping({
        server,
        path: shippingPath + '/' + shippingId,
        token,
      })
    }
  })

  it(`it should fail to retrieve any of the deleted shipping information`, async () => {
    assert(!!shippingIds.length)
    for (const shippingId of shippingIds) {
      await testGetNonExistentShipping({
        server,
        path: `${shippingPath}/${shippingId}`,
        token,
      })
    }
  })

  after(async () => deleteAllUsersForTesting())
}
