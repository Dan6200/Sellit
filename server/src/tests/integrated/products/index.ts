import chai from 'chai'
import chaiHttp from 'chai-http'
import { ProductRequestData } from '../../../types/products.js'
import {
  testPostProduct,
  testGetAllProducts,
  testGetAllProductsWithQParams,
  testGetProduct,
  testUpdateProduct,
  testDeleteProduct,
  testGetNonExistentProduct,
} from './utils/index.js'
import { UserRequestData } from '../../../types/users/index.js'
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
  userInfo: UserRequestData
  products: ProductRequestData[]
  productReplaced: ProductRequestData[]
}) {
  describe('Testing Products In Each Store', async function () {
    let token: string
    let storeId: string
    before(async () => {
      // Delete all users from Supabase auth
      await deleteAllUsersForTesting()
      // Create user after...
      await createUserForTesting(userInfo)
      token = await signInForTesting(userInfo)
      const response = await createStoreForTesting(token)
      ;({ store_id: storeId } = response.body)
    })

    const productIds: number[] = []

    const getProductsRoute = () => `/v1/stores/${storeId}/products`

    it('it should Add a couple products to each store', async () => {
      const productsRoute = getProductsRoute()

      for (const product of products) {
        const { product_id } = await testPostProduct({
          server,
          path: `${productsRoute}`,
          requestBody: product,
          token,
        })
        productIds.push(product_id)
      }
    })

    it('it should retrieve all the products', async () => {
      const productsRoute = getProductsRoute()
      await testGetAllProducts({ server, path: productsRoute, token })
    })

    it('it should retrieve all products from each store, sorted by net price ascending', async () => {
      const productsRoute = getProductsRoute()
      await testGetAllProductsWithQParams({
        server,
        path: productsRoute,
        query: {
          sort: '-net_price',
        },
        token,
      })
    })

    it('it should retrieve all products from each store, results offset by 2 and limited by 10', async () => {
      const productsRoute = getProductsRoute()
      await testGetAllProductsWithQParams({
        server,
        path: productsRoute,
        query: {
          offset: 1,
          limit: 2,
        },
        token,
      })
    })

    it('it should retrieve a specific product a vendor has for sale', async () => {
      const productsRoute = getProductsRoute()
      for (const productId of productIds) {
        await testGetProduct({
          token,
          server,
          path: `${productsRoute}/${productId}`,
        })
      }
    })

    it('it should update all the products a vendor has for sale', async () => {
      const productsRoute = getProductsRoute()
      assert(productIds?.length === productReplaced.length)
      for (const [idx, productId] of productIds.entries())
        await testUpdateProduct({
          server,
          path: `${productsRoute}/${productId}`,
          token,
          requestBody: productReplaced[idx],
        })
    })

    it('it should delete all the product a vendor has for sale', async () => {
      const productsRoute = getProductsRoute()
      for (const productId of productIds)
        await testDeleteProduct({
          token,
          server,
          path: `${productsRoute}/${productId}`,
        })
    })

    it('it should fail to retrieve any of the deleted products', async () => {
      const productsRoute = getProductsRoute()
      for (const productId of productIds)
        await testGetNonExistentProduct({
          token,
          server,

          path: `${productsRoute}/${productId}`,
        })
    })
  })
}
