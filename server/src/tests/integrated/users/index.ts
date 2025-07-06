//cspell:ignore userIds
import chai from 'chai'
import chaiHttp from 'chai-http'
import {
  testGetUser,
  testHasNoVendorAccount,
  testHasNoCustomerAccount,
} from './definitions.js'
import { UserRequestData } from '@/types/users/index.js'
import { deleteAllUsersForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'
import { signInForTesting } from '../helpers/signin-user.js'

chai.use(chaiHttp).should()

export default function ({ userInfo }: { userInfo: UserRequestData }) {
  describe('User account management', () => {
    // Set server url
    const server = process.env.SERVER!
    const path = '/v1/users'
    let token: string

    beforeEach(async function () {
      // Delete all users from Supabase auth
      await deleteAllUsersForTesting()
      // Create user after...
      await createUserForTesting(userInfo)
      token = await signInForTesting(userInfo)
    })

    it("should get the user's account", () =>
      testGetUser({
        server,
        path,
        token,
      }))

    it("should not have a customer's account", () =>
      testHasNoCustomerAccount({
        server,
        path,
        token,
      }))

    it("should not have a vendor's account", () =>
      testHasNoVendorAccount({
        server,
        path,
        token,
      }))
  })
}
