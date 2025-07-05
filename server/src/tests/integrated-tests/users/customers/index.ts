import { testPostCustomer, testDeleteCustomer } from './utils/index.js'
import { UserRequestData } from '../../../../types-and-interfaces/users/index.js'
import {
  testHasCustomerAccount,
  testHasNoCustomerAccount,
} from '../../users/definitions.js'
import { deleteAllUsersForTesting } from '../../test-route/delete-user.js'
import { createUserForTesting } from '../../test-route/create-user.js'

// Set server url
const server = process.env.SERVER!

export default function ({ userInfo }: { userInfo: UserRequestData }) {
  describe('Customer account management', () => {
    before(async () => {
      // Delete all users from Supabase auth
      await deleteAllUsersForTesting()
      // Create user after...
      await createUserForTesting(userInfo)
    })

    const path = '/v1/users/customers'
    const { email, password } = userInfo

    it('it should create a customer account for the user', () =>
      testPostCustomer({ server, path, requestBody: { email, password } }))

    it("it should show that the customer account has been created in the user's is_customer field", async () =>
      testHasCustomerAccount({
        server,
        path: '/v1/users',
        requestBody: { email, password },
      }))

    it("it should delete the user's customer account", () =>
      testDeleteCustomer({ server, path }))

    it("it should show that the customer account does not exist in the user's is_customer field", async () =>
      testHasNoCustomerAccount({
        server,
        path: '/v1/users',
        requestBody: { email, password },
      }))
  })
}
