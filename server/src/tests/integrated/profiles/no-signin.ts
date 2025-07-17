// cspell:ignore userIds
import chai from 'chai'
import chaiHttp from 'chai-http'
import { testGetProfileWithoutSignIn } from './definitions.js'
import { ProfileRequestData } from '#src/types/users/index.js'
import { deleteAllUsersForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'

chai.use(chaiHttp).should()

export default function ({ userInfo }: { userInfo: ProfileRequestData }) {
  describe('Profile profile management without sign-in', () => {
    // Set server url
    const server = process.env.SERVER!
    const path = '/v1/me'
    let token = null

    beforeEach(async function () {
      // Delete all users from Supabase auth
      await deleteAllUsersForTesting()
      // Create user but do not sign in
      await createUserForTesting(userInfo)
    })

    it('should fail to get the user profile without sign-in', () =>
      testGetProfileWithoutSignIn({
        server,
        path,
        token,
        query: { public: true },
      }))
  })
}
