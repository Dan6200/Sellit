import { testPostVendor, testDeleteVendor } from './utils/index.js'
import {
  testHasVendorAccount,
  testHasNoVendorAccount,
} from '../../users/definitions.js'
import { UserRequestData } from '@/types-and-interfaces/users/index.js'
import { knex } from '@/db/index.js'
import { supabase } from '#supabase-config'

// Set server url
const server = process.env.SERVER!

export default function ({ userInfo }: { userInfo: UserRequestData }) {
  describe('Vendor account management', () => {
    before(async () => {
      // Create a new user for each tests
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
      userIdToDelete = user.id // Update userIdToDelete with Supabase user ID
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: userInfo.email,
          password: userInfo.password,
        })
      if (signInError) throw signInError
      token = signInData.session?.access_token as string
    })

    const path = '/v1/users/vendors'
    let userIdToDelete: string = ''
    let token: string

    it('it should create a vendor user for the user', () =>
      testPostVendor({ server, path }))

    after(async () => {
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

    it("it should show that the vendor account has been created in the user's is_vendor field", async () =>
      testHasVendorAccount({
        server,

        path: '/v1/users',
      }))

    it("it should delete the user's vendor account", () =>
      testDeleteVendor({ server, path }))

    it("it should show that the vendor account does not exist in the user's is_vendor field", async () =>
      testHasNoVendorAccount({
        server,

        path: '/v1/users',
      }))
  })
}
