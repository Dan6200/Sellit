//cspell:ignore userIds
import chai from 'chai'
import chaiHttp from 'chai-http'
import { testGetUserProfile } from './definitions.js'
import { UserRequestData } from '#src/types/users/index.js'
import { deleteAllUsersForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'
import { signInForTesting } from '../helpers/signin-user.js'

chai.use(chaiHttp).should()

export default function ({ userInfo }: { userInfo: UserRequestData }) {
  describe('User account management', () => {
    // Set server url
    const server = process.env.SERVER!
    const path = '/v1/me'
    let token: string

    beforeEach(async function () {
      // Delete all users from Supabase auth
      await deleteAllUsersForTesting()
      // Create user after...
      await createUserForTesting(userInfo)
      token = await signInForTesting(userInfo)
    })

    it("should get the user's profile", () =>
      testGetUserProfile({
        server,
        path,
        token,
      }))
  })
}
