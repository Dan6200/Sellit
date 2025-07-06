import chai from 'chai'
import chaiHttp from 'chai-http'
import {
  testGetAllProductsPublic,
  testGetProductPublic,
} from '../../products/utils/index.js'

// globals
chai.use(chaiHttp).should()
// Set server url
const server = process.env.SERVER!

export default function () {
  const productsRoute = '/v1/products'
  const productIds: number[] = []

  describe('Testing Retrieving Publicly accessible Products', async function () {
    it('it should retrieve all the products', async () => {
      await testGetAllProductsPublic({
        server,
        path: productsRoute,
        query: { public: true },
      })
    })

    it('it should retrieve a specific product', async () => {
      for (const productId of productIds) {
        await testGetProductPublic({
          server,
          path: `${productsRoute}/${productId}`,
          query: { public: true },
        })
      }
    })

    //end
  })
}
