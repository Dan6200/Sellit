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
import { knex } from '../../../db/index.js'
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
      // Delete users from db
        await knex('users').where('uid', uidToDelete).del()
        // Delete all users from Supabase auth
        await supabase.auth.admin
          .catch((error: Error) =>
            console.error(
              `failed to delete user with uid ${uidToDelete}: ${error}`,
            ),
          )
      } else console.log(`UID: ${uidToDelete}`)
    })

    it('should create a new user', async () => {
      // Create a new user for each tests
      const postUserParams = {
        server,
        path,
        body: userInfo,
      }
      if (!isValidPostUserParams(postUserParams))
        throw new Error('Invalid parameter object')
      const response = await testPostUser(postUserParams).catch((error) =>
        console.error(error),
      )
      // For testing, we'll create a user directly in Supabase and then sign in with email/password
      // This replaces the Firebase custom token approach
      const {
        data: { user },
        error,
      } = await supabase.auth.admin.createUser({
        email: userInfo.email,
        password: userInfo.password,
        email_confirm: true,
      })
      if (error) throw error
      uidToDelete = user.id // Update uidToDelete with Supabase user ID
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: userInfo.email,
          password: userInfo.password,
        })
      if (signInError) throw signInError
      token = signInData.session?.access_token as string
    })

    it("it should get the user's account", () =>
      testGetUser({ server, token, path }))

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

    after(async () => {
      // Delete users from db
      if (uidToDelete) {
        await knex('users').where('uid', uidToDelete).del()
        // Delete all users from Supabase auth
        await supabase.auth.admin
          .deleteUser(uidToDelete)
          .catch((error: Error) =>
            console.error(
              `failed to delete user with uid ${uidToDelete}: ${error}`,
            ),
          )
      } else console.log(`UID: ${uidToDelete}`)
    })
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
