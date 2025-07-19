// cspell:ignore userIds
import chai from 'chai'
import chaiHttp from 'chai-http'
import { testGetProfileWithoutSignIn } from './definitions.js'
import { ProfileRequestData } from '#src/types/profile/index.js'
import { deleteUserForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'

chai.use(chaiHttp).should()

export default function ({ userInfo }: { userInfo: ProfileRequestData }) {
  // Set server url
  const server = process.env.SERVER!
  const path = '/v1/me'
  let token: string
  let userId: string

  before(async function () {
    userId = await createUserForTesting(userInfo)
  })

  it('should fail to get the user profile without sign-in', () =>
    testGetProfileWithoutSignIn({
      server,
      path,
      token,
      query: { public: true },
    }))

  after(async () => await deleteUserForTesting(userId))
}
