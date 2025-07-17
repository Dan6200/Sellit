//cspell:ignore cloudinary
import { ProfileRequestData } from '#src/types/users/index.js'
import { ProductRequestData, ProductMedia } from '#src/types/products.js'
import { testUploadProductMedia } from '../products/definitions/index.js'
import { bulkDeleteImages } from '../utils/bulk-delete.js'
import { deleteAllUsersForTesting } from '../helpers/delete-user.js'
import { createUserForTesting } from '../helpers/create-user.js'
import { signInForTesting } from '../helpers/signin-user.js'
import { createStoreForTesting } from '../helpers/create-store.js'
import { createProductsForTesting } from '../helpers/create-product.js'

// globals
const mediaRoute = '/v1/media'
const server: string = process.env.SERVER!

export default function ({
  userInfo,
  productMedia,
}: {
  userInfo: ProfileRequestData
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
