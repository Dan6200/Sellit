import { testPostVendor, testDeleteVendor } from './definitions/index.js'
import {
  testHasVendorAccount,
  testHasNoVendorAccount,
} from '../../users/definitions.js'
import { UserRequestData } from '@/types-and-interfaces/users/index.js'
import { deleteAllUsersForTesting } from '../../test-route/delete-user.js'
import { createUserForTesting } from '../../test-route/create-user.js'

// Set server url
const server = process.env.SERVER!

export default function ({ userInfo }: { userInfo: UserRequestData }) {
  describe('Vendor account management', () => {
    before(async () => {
      // Delete all users from Supabase auth
      await deleteAllUsersForTesting()
      // Create user after...
      await createUserForTesting(userInfo)
    })
    const { email, password } = userInfo

    const path = '/v1/users/vendors'

    it('it should create a vendor user for the user', () =>
      testPostVendor({ server, path, requestBody: { email, password } }))

    it("it should show that the vendor account has been created in the user's is_vendor field", async () =>
      testHasVendorAccount({
        server,

        requestBody: { email, password },
        path: '/v1/users',
      }))

    it("it should delete the user's vendor account", () =>
      testDeleteVendor({ server, path, requestBody: { email, password } }))

    it("it should show that the vendor account does not exist in the user's is_vendor field", async () =>
      testHasNoVendorAccount({
        server,
        requestBody: { email, password },
        path: '/v1/users',
      }))
  })
}
