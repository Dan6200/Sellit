import { testPostVendor, testDeleteVendor } from './definitions/index.js'
import {
  testHasVendorAccount,
  testHasNoVendorAccount,
} from '../../users/definitions.js'
import { UserRequestData } from '@/types/users/index.js'
import { deleteAllUsersForTesting } from '../../helpers/delete-user.js'
import { createUserForTesting } from '../../helpers/create-user.js'
import { signInForTesting } from '../../helpers/signin-user.js'

// Set server url

export default function ({ userInfo }: { userInfo: UserRequestData }) {
  describe('Vendor account management', () => {
    const server = process.env.SERVER!
    const path = '/v1/users/vendors'
    let token: string

    before(async () => {
      await deleteAllUsersForTesting()
      await createUserForTesting(userInfo)
      token = await signInForTesting(userInfo)
    })

    it('it should create a vendor user for the user', () =>
      testPostVendor({ server, path, token }))

    it("it should show that the vendor account has been created in the user's is_vendor field", async () =>
      testHasVendorAccount({
        server,
        token,
        path: '/v1/users',
      }))

    it("it should delete the user's vendor account", () =>
      testDeleteVendor({ server, path, token }))

    it("it should show that the vendor account does not exist in the user's is_vendor field", async () =>
      testHasNoVendorAccount({
        server,
        token,
        path: '/v1/users',
      }))
  })
}
