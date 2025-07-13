//cspell:ignore cloudinary
import { knex } from '../../../db/index.js'
import { UserRequestData } from '#src/types/users/index.js'
import { ProductRequestData, ProductMedia } from '#src/types/products.js'
import {
  testPostProduct,
  testUploadProductMedia,
} from '../products/definitions/index.js'
import { supabase } from '#supabase-config'
import { bulkDeleteImages } from '../utils/bulk-delete.js'
import { deleteAllUsersForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import { createStoreForTesting } from '../helpers/create-store.js'
import { createProductsForTesting } from '../helpers/create-product.js'

// globals
const mediaRoute = '/v1/media'
const vendorsRoute = '/v1/users/vendors/'
const productsRoute = '/v1/products'
let token: string
const server: string = process.env.SERVER!
let userIdToDelete: string
const productIds: number[] = []

export default function ({
  userInfo,
  productMedia,
}: {
  userInfo: UserRequestData
  products: ProductRequestData[]
  productMedia: ProductMedia[][]
}) {
  describe('Product media management', () => {
    let token: string
    let product_id: string
    before(async () => {
      // Delete all users from Supabase auth
      await deleteAllUsersForTesting()
      // Create user after...
      await createUserForTesting(userInfo)
      token = await signInForTesting(userInfo)
      const {
        body: { store_id },
      } = await createStoreForTesting(token)
      ;({
        body: { product_id },
      } = await createProductsForTesting(token, store_id))
      // Bulk delete media from cloudinary
      await bulkDeleteImages()
    })

    // Create a product for the store
    it("it should add the product's media to an existing product", async () => {
      for (const media of productMedia) {
        await testUploadProductMedia(server, mediaRoute, media, userInfo, {
          product_id,
        })
      }
    })
  })

  after(async () => {
    await deleteAllUsersForTesting()
    await bulkDeleteImages()
  })
}
