//cspell:disable
import testUserAccount from './users/index.js'
import testUserAccountWithoutSignIn from './users/no-signin.js'
import testCustomerAccount from './users/customers/index.js'
import testVendorAccount from './users/vendors/index.js'
import testStoresWithNoVendor from './stores/no-vendor-account.js'
import testStores from './stores/index.js'
import testShipping from './shipping-info/index.js'
import testProducts from './products/index.js'
import testPublicProducts from './public/products/index.js'
import testMedia from './media/index.js'
import * as Ebuka from './data/users/customers/user-ebuka/index.js'
import * as Aisha from './data/users/customers/user-aisha/index.js'
import * as Mustapha from './data/users/customers/user-mustapha/index.js'
import * as Aliyu from './data/users/vendors/user-aliyu/index.js'

const users = [Ebuka, Aliyu, Aisha, Mustapha]
const customers = [Ebuka, Aisha, Mustapha]
const vendors = [Aliyu]

export default function (): void {
  /** Public Routes **/

  /** Products **/

  describe(`Testing Public Product Route`, () => testPublicProducts())

  /** Private Routes **/

  /** User Account actions **/

  for (let user of users) {
    const { userInfo } = user
    const { first_name: name } = userInfo
    describe(`Testing User Account for ${name}`, () => testUserAccount(user))
    describe(`Testing User Account without Signing In`, () =>
      testUserAccountWithoutSignIn(user))
  }

  /** Customer Account actions **/

  for (let customer of customers) {
    const { userInfo } = customer
    const { first_name: name } = userInfo
    describe(`Testing Customer Account for ${name}`, () =>
      testCustomerAccount(customer))
  }

  /** Shipping Info related tests **/

  for (let customer of customers) {
    const { userInfo } = customer
    const { first_name: name } = userInfo
    describe(`Testing the Shipping Information of ${name}'s account`, async () =>
      testShipping(customer))
  }

  /** Vendor Account actions **/

  for (let vendor of vendors) {
    const { userInfo } = vendor
    const { first_name: name } = userInfo
    describe(`Testing Vendor Account for ${name}`, () =>
      testVendorAccount(vendor))
  }

  /** Stores related tests **/

  for (let vendor of vendors) {
    describe(`Testing Stores owned by No One`, () =>
      testStoresWithNoVendor(vendor))
  }

  for (let vendor of vendors) {
    const { userInfo } = vendor
    const { first_name: name } = userInfo
    describe(`Testing Stores owned by ${name}`, () => testStores(vendor))
  }

  /** Product related tests **/

  for (let vendor of vendors) {
    const { userInfo } = vendor
    const { first_name: name } = userInfo
    describe(`Testing Products listed by ${name}`, async () =>
      testProducts(vendor))
  }

  /** Media related tests **/

  for (let vendor of vendors) {
    describe(`Testing Media for Different Products`, async () =>
      testMedia(vendor))
  }

  // end
}
