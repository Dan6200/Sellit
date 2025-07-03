//cspell:ignore cloudinary
import { knex } from '../../../db/index.js'
import { UserRequestData } from '@/types-and-interfaces/users/index.js'
import {
  ProductRequestData,
  ProductMedia,
} from '@/types-and-interfaces/products.js'
import {
  testPostProduct,
  testUploadProductMedia,
} from '../products/utils/index.js'
import { testPostVendor } from '../users/vendors/utils/index.js'
import { supabase } from '#supabase-config'
import { bulkDeleteImages } from '../utils/bulk-delete.js'

// globals
const mediaRoute = '/v1/media'
const vendorsRoute = '/v1/users/vendors/'
const productsRoute = '/v1/products'
let token: string
const server: string = process.env.SERVER!
let uidToDelete: string
const productIds: number[] = []

export default function ({
  userInfo,
  products,
  productMedia,
}: {
  userInfo: UserRequestData
  products: ProductRequestData[]
  productMedia: ProductMedia[][]
}) {
  describe('Product media management', () => {
    before(async () => {
      // Bulk delete media from cloudinary
      await bulkDeleteImages()
      // For testing, we'll create a user directly in Supabase and then sign in with email/password
      // This replaces the Firebase custom token approach
      const { email, password, ...user_metadata } = userInfo
      const {
        data: { user },
        error,
      } = await supabase.auth.admin.createUser({
        email: userInfo.email,
        password: userInfo.password,
        user_metadata,
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
      await testPostVendor({ server, path: vendorsRoute })
      for (const product of products) {
        const { product_id } = await testPostProduct({
          server,

          path: `${productsRoute}`,
          body: product,
        })
        productIds.push(product_id)
      }
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
      // Bulk delete media from cloudinary
      await bulkDeleteImages()
    })

    // Create a product for the store
    it("it should add the product's media to an existing product", async () => {
      for (const [idx, productId] of productIds.entries())
        await testUploadProductMedia(
          server,
          mediaRoute,
          productMedia[idx],
          userInfo,
          {
            productId,
          },
        )
    })
  })
}
