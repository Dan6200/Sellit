import { testPostCustomer, testDeleteCustomer } from './utils/index.js'
import { UserRequestData } from '../../../../types-and-interfaces/users/index.js'
import {
  testHasCustomerAccount,
  testHasNoCustomerAccount,
} from '../../users/definitions.js'
import { supabase } from '#supabase-config'
import { knex } from '../../../../db/index.js'

// Set server url
const server = process.env.SERVER!

export default function ({ userInfo }: { userInfo: UserRequestData }) {
  describe('Customer account management', () => {
    before(async () => {
      /* Create a new user for each tests */
    })

    const path = '/v1/users/customers'
    let uidToDelete: string = ''

    it('it should create a customer user for the user', () =>
      testPostCustomer({ server, path }))

    after(async () => {
      // Delete users from db
      if (uidToDelete) await knex('users').where('uid', uidToDelete).del()
      // Delete all users from firebase auth
      await supabase.auth.admin
        .deleteUser(uidToDelete)
        .catch((error: Error) =>
          console.error(
            `failed to delete user with uid ${uidToDelete}: ${error}`,
          ),
        )
    })

    it("it should show that the customer account has been created in the user's is_customer field", async () =>
      testHasCustomerAccount({
        server,
        path: '/v1/users',
      }))

    it("it should delete the user's customer account", () =>
      testDeleteCustomer({ server, path }))

    it("it should show that the customer account does not exist in the user's is_customer field", async () =>
      testHasNoCustomerAccount({
        server,
        path: '/v1/users',
      }))
  })
}
