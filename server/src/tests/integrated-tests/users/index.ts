//cspell:ignore uids
import chai from 'chai'
import chaiHttp from 'chai-http'
import {
  testGetUser,
  testPatchUser,
  testDeleteUser,
  testGetNonExistentUser,
  testHasNoVendorAccount,
  testHasNoCustomerAccount,
} from './definitions.js'
import { UserRequestData } from '@/types-and-interfaces/users/index.js'
import { deleteAllUsersForTesting } from '../test-route/delete-user.js'
import { createUserForTesting } from '../test-route/create-user.js'

chai.use(chaiHttp).should()

// Set server url
const server = process.env.SERVER!

export default function ({
  userInfo,
  updatedUserInfo,
}: {
  userInfo: UserRequestData
  updatedUserInfo: UserRequestData
}) {
  const path = '/v1/users'

  describe('User account management', () => {
    beforeEach(async () => {
      // Delete all users from Supabase auth
      await deleteAllUsersForTesting()
      // Create user after...
      await createUserForTesting(userInfo)
    })

    it("it should get the user's account", () =>
      testGetUser({
        server,
        requestBody: { email: userInfo.email, password: userInfo.password },
        path,
      }))

    it("it should not have a customer's account", () =>
      testHasNoCustomerAccount({
        server,
        path,
        requestBody: { email: userInfo.email, password: userInfo.password },
      }))

    it("it should not have a vendor's account", () =>
      testHasNoVendorAccount({
        server,
        path,
        requestBody: { email: userInfo.email, password: userInfo.password },
      }))

    it("it should delete the user's account", () =>
      testDeleteUser({
        server,
        path,
        requestBody: { email: userInfo.email, password: userInfo.password },
      }))

    it("it should update the user's account", async () => {
      const { ...requestBody } = {
        ...userInfo,
        ...updatedUserInfo,
      }
      return testPatchUser({
        server,
        path,
        requestBody,
      })
    })
  })
}
