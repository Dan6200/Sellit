import chai from 'chai'
import chaiHttp from 'chai-http'
import { ProductRequestData } from '../../../types-and-interfaces/products.js'
import {
  testPostProduct,
  testGetAllProducts,
  testGetAllProductsWithQParams,
  testGetProduct,
  testUpdateProduct,
  testDeleteProduct,
  testGetNonExistentProduct,
} from './utils/index.js'
import { testPostVendor } from '../users/vendors/utils/index.js'
import { UserRequestData } from '../../../types-and-interfaces/users/index.js'
import assert from 'assert'
import { knex } from '../../../db/index.js'
import { isValidPostUserParams } from '../users/index.js'
import { testPostUser } from '../users/utils/index.js'
import { supabase } from '#supabase-config'

// globals
chai.use(chaiHttp).should()
// Set server url
const server = process.env.SERVER!

export default function ({
  userInfo,
  products,
  productReplaced,
}: {
  userInfo: UserRequestData
  products: ProductRequestData[]
  productReplaced: ProductRequestData[]
}) {
  before(async () => {
    // Create a new user for each tests
    const postUserParams = {
      server,
      path: '/v1/users',
      body: userInfo,
    }
    if (!isValidPostUserParams(postUserParams))
      throw new Error('Invalid parameter object')
    const response = await testPostUser(postUserParams)
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
    await testPostVendor({ server, token, path: vendorsRoute })
  })

  after(async function () {
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

  let token: string
  let uidToDelete: string
  const vendorsRoute = '/v1/users/vendors/'
  const productsRoute = '/v1/products'
  const productIds: number[] = []

  describe('Testing Products In Each Store', async function () {
    it('it should Add a couple products to each store', async () => {
      for (const product of products) {
        const { product_id } = await testPostProduct({
          server,
          token,
          path: `${productsRoute}`,
          body: product,
        })
        productIds.push(product_id)
      }
    })

    it('it should retrieve all the products', async () => {
      await testGetAllProducts({ server, token, path: productsRoute })
    })

    it('it should retrieve all products from each store, sorted by net price ascending', async () => {
      await testGetAllProductsWithQParams({
        server,
        token,
        path: productsRoute,
        query: {
          sort: '-net_price',
        },
      })
    })

    it('it should retrieve all products from each store, results offset by 2 and limited by 10', async () => {
      await testGetAllProductsWithQParams({
        server,
        token,
        path: productsRoute,
        query: {
          offset: 1,
          limit: 2,
        },
      })
    })

    it('it should retrieve a specific product a vendor has for sale', async () => {
      for (const productId of productIds) {
        await testGetProduct({
          server,
          token,
          path: `${productsRoute}/${productId}`,
        })
      }
    })

    it('it should update all the products a vendor has for sale', async () => {
      assert(productIds?.length === productReplaced.length)
      for (const [idx, productId] of productIds.entries())
        await testUpdateProduct({
          server,
          token,
          path: `${productsRoute}/${productId}`,
          body: productReplaced[idx],
        })
    })

    it('it should delete all the product a vendor has for sale', async () => {
      for (const productId of productIds)
        await testDeleteProduct({
          server,
          token,
          path: `${productsRoute}/${productId}`,
        })
    })

    it('it should fail to retrieve any of the deleted products', async () => {
      for (const productId of productIds)
        await testGetNonExistentProduct({
          server,
          token,
          path: `${productsRoute}/${productId}`,
        })
    })

    //end
  })
}
