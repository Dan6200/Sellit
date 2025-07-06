import { testPostCustomer, testDeleteCustomer } from './definitions/index.js'
import { UserRequestData } from '../../../../types/users/index.js'
import {
  testHasCustomerAccount,
  testHasNoCustomerAccount,
} from '../../users/definitions.js'
import { deleteAllUsersForTesting } from '../../helpers/delete-user.js'
import { createUserForTesting } from '../../helpers/create-user.js'
import { signInForTesting } from '../../helpers/signin-user.js'

export default function ({ userInfo }: { userInfo: UserRequestData }) {
  describe('Customer account management', () => {
    // Set server url
    const server = process.env.SERVER!
    let token: string
    const path = '/v1/users/customers'

    before(async () => {
      await deleteAllUsersForTesting()
      await createUserForTesting(userInfo)
      token = await signInForTesting(userInfo)
    })

    it('it should create a customer account for the user', () =>
      testPostCustomer({ server, path, token }))

    it("it should show that the customer account has been created in the user's is_customer field", async () =>
      testHasCustomerAccount({
        server,
        path: '/v1/users',
        token,
      }))

    it("it should delete the user's customer account", () =>
      testDeleteCustomer({ server, path, token }))

    it("it should show that the customer account does not exist in the user's is_customer field", async () =>
      testHasNoCustomerAccount({
        server,
        path: '/v1/users',
        token,
      }))
  })
}
