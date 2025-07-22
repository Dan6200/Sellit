//cspell:ignore userIds
import chai from 'chai'
import chaiHttp from 'chai-http'
import { testGetProfile } from './definitions.js'
import { ProfileRequestData } from '#src/types/profile/index.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'
import { signInForTesting } from '../helpers/signin-user.js'

chai.use(chaiHttp).should()

export default function ({ userInfo }: { userInfo: ProfileRequestData }) {
  describe('Profile management', () => {
    // Set server url
    const server = process.env.SERVER!
    const path = '/v1/me'
    let token: string
    let userId: string

    before(async function () {
      userId = await createUserForTesting(userInfo)
      token = await signInForTesting(userInfo)
    })

    it("should get the user's profile", () =>
      testGetProfile({
        server,
        path,
        token,
      }))

    after(async () => await deleteUserForTesting(userId))
  })
}
