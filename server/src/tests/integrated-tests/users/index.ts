//cspell:ignore uids
import chai from 'chai'
import chaiHttp from 'chai-http'
import {
  testPostUser,
  testGetUser,
  testPatchUser,
  testDeleteUser,
  testGetNonExistentUser,
} from './utils/index.js'
import { CreateRequestParams } from '@/types-and-interfaces/test-routes.js'
import { supabase } from '#supabase-config'
import { UserRequestData } from '@/types-and-interfaces/users/index.js'

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
  let token: string = ''
  describe('User account management', () => {
    before(async () => {
      // Delete all users from Supabase auth
      const { data, error } = await supabase.auth.admin.listUsers()
      if (error) {
        console.error('Failed to list users:', error)
        return
      }

      if (data && data.users.length > 0) {
        for (const user of data.users) {
          await supabase.auth.admin
            .deleteUser(user.id)
            .catch((deleteError: Error) =>
              console.error(
                `Failed to delete user with uid ${user.id}: ${deleteError}`,
              ),
            )
        }
        console.log(`Deleted ${data.users.length} users from Supabase auth.`)
      } else {
        console.log('No users to delete from Supabase auth.')
      }
    })

    it("it should get the user's account", () =>
      testGetUser({
        server,
        token,
        body: { email: userInfo.email, password: userInfo.password },
        path,
      }))

    it("it should update the user's account", () =>
      testPatchUser({
        server,
        token,
        path,
        query: undefined,
        body: updatedUserInfo,
      }))

    it("it should delete the user's account", () =>
      testDeleteUser({ server, token, path }))

    it("it should fail to get user's account", () =>
      testGetNonExistentUser({ server, token, path }))
  })
}

export const isValidPostUserParams = (
  obj: unknown,
): obj is CreateRequestParams =>
  typeof obj === 'object' &&
  obj !== null &&
  'body' in obj &&
  'server' in obj &&
  'path' in obj
