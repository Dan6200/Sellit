import { testPostVendor, testDeleteVendor } from './utils/index.js'
import {
  testHasVendorAccount,
  testHasNoVendorAccount,
  testPostUser,
} from '../../users/utils/index.js'
import { isValidPostUserParams } from '../index.js'
import { UserRequestData } from '@/types-and-interfaces/users/index.js'
import { knex } from '@/db/index.js'
import { supabase } from '#supabase-config'

// Set server url
const server = process.env.SERVER!

export default function ({ userInfo }: { userInfo: UserRequestData }) {
  describe('Vendor account management', () => {
    before(async () => {
      // Create a new user for each tests
      const postUserParams = {
        server,
        path: '/v1/users',
        body: userInfo,
      }
      if (!isValidPostUserParams(postUserParams))
        throw new Error('Invalid parameter object')
      const response = await testPostUser(postUserParams)
      // For testing, we'll create a user directly in Supabase and then sign in with email/password
      // This replaces the Firebase custom token approach
      const {
        data: { user },
        error,
      } = await supabase.auth.admin.createUser({
        email: userInfo.email,
        password: userInfo.password,
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
    })

    const path = '/v1/users/vendors'
    let uidToDelete: string = ''
    let token: string

    it('it should create a vendor user for the user', () =>
      testPostVendor({ server, token, path }))

    after(async () => {
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

    it("it should show that the vendor account has been created in the user's is_vendor field", async () =>
      testHasVendorAccount({
        server,
        token,
        path: '/v1/users',
      }))

    it("it should delete the user's vendor account", () =>
      testDeleteVendor({ server, token, path }))

    it("it should show that the vendor account does not exist in the user's is_vendor field", async () =>
      testHasNoVendorAccount({
        server,
        token,
        path: '/v1/users',
      }))
  })
}
