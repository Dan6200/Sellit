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
    await testPostVendor({ server, path: vendorsRoute })
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
          path: `${productsRoute}`,
          body: product,
        })
        productIds.push(product_id)
      }
    })

    it('it should retrieve all the products', async () => {
      await testGetAllProducts({ server, path: productsRoute })
    })

    it('it should retrieve all products from each store, sorted by net price ascending', async () => {
      await testGetAllProductsWithQParams({
        server,
        path: productsRoute,
        query: {
          sort: '-net_price',
        },
      })
    })

    it('it should retrieve all products from each store, results offset by 2 and limited by 10', async () => {
      await testGetAllProductsWithQParams({
        server,
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
          path: `${productsRoute}/${productId}`,
        })
      }
    })

    it('it should update all the products a vendor has for sale', async () => {
      assert(productIds?.length === productReplaced.length)
      for (const [idx, productId] of productIds.entries())
        await testUpdateProduct({
          server,
          path: `${productsRoute}/${productId}`,
          body: productReplaced[idx],
        })
    })

    it('it should delete all the product a vendor has for sale', async () => {
      for (const productId of productIds)
        await testDeleteProduct({
          server,
          path: `${productsRoute}/${productId}`,
        })
    })

    it('it should fail to retrieve any of the deleted products', async () => {
      for (const productId of productIds)
        await testGetNonExistentProduct({
          server,

          path: `${productsRoute}/${productId}`,
        })
    })

    //end
  })
}
