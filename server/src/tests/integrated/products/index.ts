import chai from 'chai'
import chaiHttp from 'chai-http'
import { ProductRequestData } from '../../../types/products.js'
import {
  testPostProduct,
  testGetAllProducts,
  testGetProduct,
  testUpdateProduct,
  testDeleteProduct,
  testGetNonExistentProduct,
} from './definitions/index.js'
import { ProfileRequestData } from '../../../types/profile/index.js'
import assert from 'assert'
import { createUserForTesting } from '../helpers/create-user.js'
import { deleteAllUsersForTesting } from '../helpers/delete-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import { createStoreForTesting } from '../helpers/create-store.js'

// globals
chai.use(chaiHttp).should()
// Set server url
const server = process.env.SERVER!

export default function ({
  userInfo,
  products,
  productReplaced,
}: {
  userInfo?: ProfileRequestData
  products?: ProductRequestData[]
  productReplaced?: ProductRequestData[]
}) {
  describe('Testing Products In Each Store', async function () {
    let token: string
    let store_id: string
    before(async () => {
      // Delete all users from Supabase auth
      await deleteAllUsersForTesting()
      // Create user after...
      await createUserForTesting(userInfo)
      token = await signInForTesting(userInfo)
      const response = await createStoreForTesting(token)
      ;({ store_id } = response.body)
    })

    const productIds: number[] = []

    const getProductsRoute = () => `/v1/products/`

    it('it should Add a couple products to each store', async () => {
      const productsRoute = getProductsRoute()

      for (const product of products) {
        const { product_id } = await testPostProduct({
          server,
          path: `${productsRoute}`,
          requestBody: product,
          query: { store_id },
          token,
        })
        productIds.push(product_id)
      }
    })

    it('it should retrieve all the products', async () => {
      const productsRoute = getProductsRoute()
      await testGetAllProducts({
        server,
        path: productsRoute,
        token,
        query: { store_id },
      })
    })

    it('it should retrieve all products from each store, sorted by net price ascending', async () => {
      const productsRoute = getProductsRoute()
      await testGetAllProducts({
        server,
        path: productsRoute,
        query: {
          sort: '-net_price',
          store_id,
        },
        token,
      })
    })

    it('it should retrieve all products from each store, results offset by 2 and limited by 10', async () => {
      const productsRoute = getProductsRoute()
      await testGetAllProducts({
        server,
        path: productsRoute,
        query: {
          store_id,
          offset: 1,
          limit: 2,
        },
        token,
      })
    })

    it('it should retrieve a specific product a vendor has for sale', async () => {
      assert(!!productIds.length)
      const productsRoute = getProductsRoute()
      for (const productId of productIds) {
        await testGetProduct({
          token,
          server,
          path: `${productsRoute}/${productId}`,
          query: { store_id },
        })
      }
    })

    it('it should update all the products a vendor has for sale', async () => {
      const productsRoute = getProductsRoute()
      assert(
        !!productIds.length && productIds?.length === productReplaced.length,
      )
      for (const [idx, productId] of productIds.entries())
        await testUpdateProduct({
          server,
          path: `${productsRoute}/${productId}`,
          token,
          requestBody: productReplaced[idx],
          query: { store_id },
        })
    })

    it('it should delete all the product a vendor has for sale', async () => {
      assert(!!productIds.length)
      const productsRoute = getProductsRoute()
      for (const productId of productIds)
        await testDeleteProduct({
          token,
          server,
          path: `${productsRoute}/${productId}`,
          query: { store_id },
        })
    })

    it('it should delete all the product a vendor has for sale', async () => {
      assert(!!productIds.length)
      const productsRoute = getProductsRoute()
      for (const productId of productIds)
        await testDeleteProduct({
          query: { store_id },
          token,
          server,
          path: `${productsRoute}/${productId}`,
        })
    })

    it('it should fail to retrieve any of the deleted products', async () => {
      assert(!!productIds.length)
      const productsRoute = getProductsRoute()
      for (const productId of productIds)
        await testGetNonExistentProduct({
          query: { store_id },
          token,
          server,

          path: `${productsRoute}/${productId}`,
        })
    })
  })

  after(async () => deleteAllUsersForTesting())
}
