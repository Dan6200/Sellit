//cspell:ignore uids
import chai from 'chai'
import chaiHttp from 'chai-http'
import {
  testGetUser,
  testPatchUser,
  testDeleteUser,
  testGetNonExistentUser,
} from './utils/index.js'
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
    before(async () => {
      // Delete all users from Supabase auth
      await deleteAllUsersForTesting()
      // Create user after...
      await createUserForTesting(userInfo)
    })

    it("it should get the user's account", () =>
      testGetUser({
        server,
        requestBody: userInfo,
        path,
      }))

    it("it should delete the user's account", () =>
      testDeleteUser({ server, path, requestBody: userInfo }))

    it("it should fail to get user's account", () =>
      testGetNonExistentUser({ server, requestBody: userInfo, path }))

    it("it should update the user's account", () => {
      const { password, ...requestBody } = {
        ...userInfo,
        ...updatedUserInfo,
      } /* Send both to be able to sign in.. In a real client environment only updated payload would be sent... */
      return testPatchUser({
        server,
        path,
        requestBody,
      })
    })
  })
}
