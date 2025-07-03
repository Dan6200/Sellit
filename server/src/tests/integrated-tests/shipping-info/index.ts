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
import { isValidPostUserParams } from '../users/index.js'
import { testPostUser } from '../users/utils/index.js'

// Set server url
const server = process.env.SERVER!
let token: string

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
    // Create a new user for each tests
    const postUserParams = {
      server,
      path: '/v1/users',
      body: userInfo,
    }
    if (!isValidPostUserParams(postUserParams))
      throw new Error('Invalid parameter object')
    await testPostUser(postUserParams)
    // For testing, we'll create a user directly in Supabase and then sign in with email/password
    // This replaces the Firebase custom token approach
    const { email, password, ...user_metadata } = userInfo
    const {
      data: { user },
      error,
    } = await supabase.auth.admin.createUser({
      email: userInfo.email,
      password: userInfo.password,
      user_metadata,
      email_confirm: true,
    })
    if (error) throw error
    uidToDelete = user.id // Update uidToDelete with Supabase user ID
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: userInfo.email,
        password: userInfo.password,
      })
    if (signInError) throw signInError
    token = signInData.session?.access_token as string
    await testPostCustomer({ server, token, path: '/v1/users/customers' })
  })

  after(async function () {
    // Delete users from db
    if (uidToDelete) await knex('users').where('uid', uidToDelete).del()
    // Delete all users from firebase auth
    await supabase.auth.admin
      .deleteUser(uidToDelete)
      .catch((error: Error) =>
        console.error(
          `failed to delete user with uid ${uidToDelete}: ${error}`,
        ),
      )
  })

  const shippingPath = '/v1/shipping-info'
  let uidToDelete = ''

  const shippingIds: number[] = []

  it(`it should add multiple shipping addresses for the customer`, async () => {
    for (const shippingInfo of listOfShippingInfo) {
      const { shipping_info_id } = await testCreateShipping({
        server,
        token,
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
        token,
        path: shippingPath + '/' + shippingId,
      })
    }
  })

  it(`it should update all shipping addresses for the customer`, async () => {
    assert(shippingIds.length === listOfUpdatedShippingInfo.length)
    for (const [idx, shippingId] of shippingIds.entries()) {
      await testUpdateShipping({
        server,
        token,
        path: shippingPath + '/' + shippingId,
        body: listOfUpdatedShippingInfo[idx],
      })
    }
  })

  it(`it should delete all shipping addresses for the customer`, async () => {
    for (const shippingId of shippingIds) {
      await testDeleteShipping({
        server,
        token,
        path: shippingPath + '/' + shippingId,
      })
    }
  })

  it(`it should fail to retrieve any of the deleted shipping information`, async () => {
    for (const shippingId of shippingIds) {
      await testGetNonExistentShipping({
        server,
        token,
        path: `${shippingPath}/${shippingId}`,
      })
    }
  })
}
