//cspell:disable
import testProfile from './profiles/index.js'
import testProfileWithoutSignIn from './profiles/no-signin.js'
import testStoresWithNoVendor from './stores/no-vendor-account.js'
import testStores from './stores/index.js'
import testDelivery from './delivery-info/index.js'
import testProducts from './products/index.js'
import testMedia from './media/index.js'
import * as Ebuka from './data/users/customers/user-ebuka/index.js'
import * as Aisha from './data/users/customers/user-aisha/index.js'
import * as Mustapha from './data/users/customers/user-mustapha/index.js'
import * as Aliyu from './data/users/vendors/user-aliyu/index.js'

const users = [Ebuka, Aliyu, Aisha, Mustapha]
const customers = [Ebuka, Aisha, Mustapha] // is_customer is true
const vendors = [Aliyu] // is_vendor is true

export default function (): void {
  /** User Account actions **/

  for (let user of users) {
    const { userInfo } = user
    const { first_name: name } = userInfo
    describe(`Testing retrieving user Profile for ${name}`, () =>
      testProfile(user))
    describe(`Testing retrieving user Profile without Signing In`, () =>
      testProfileWithoutSignIn(user))
  }

  /** Delivery Info related tests **/

  for (let customer of customers) {
    const { userInfo } = customer
    const { first_name: name } = userInfo
    describe(`Testing the Delivery Information of ${name}'s account`, async () =>
      testDelivery(customer))
  }

  /** Stores related tests **/

  for (let vendor of vendors) {
    describe(`Testing Store access without a vendor account`, () =>
      testStoresWithNoVendor({
        userInfo: vendor.userInfo,
        stores: vendor.listOfStores,
        updatedStores: vendor.updatedStores,
      }))
  }

  for (let vendor of vendors) {
    const { userInfo } = vendor
    const { first_name: name } = userInfo
    describe(`Testing Stores owned by ${name}`, () =>
      testStores({
        userInfo: vendor.userInfo,
        stores: vendor.listOfStores,
        updatedStores: vendor.updatedStores,
      }))
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
  //
  // end
}
