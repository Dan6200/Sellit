import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { readFile } from 'node:fs/promises'
import {
  ProductMedia,
  isValidProductRequestData,
  isValidProductResponseData,
  isValidProductGETAllResponseData,
  isValidProductGETResponseData,
} from '../../../../types/products.js'
import {
  TestRequestWithQParams,
  TestRequestWithQParamsAndBody,
} from '../../test-request/types.js'
import testRoutes from '../../test-request/index.js'
import { UserRequestData } from '@/types/users/index.js'
import { signInForTesting } from '../../helpers/signin-user.js'

chai.use(chaiHttp).should()

const { CREATED, OK, NOT_FOUND } = StatusCodes

// export const testCreateProduct = async function* ({
//   server,
//   token,
//   path,
//   query,
//   dataList,
// }: {
//   server: string
//   token: string
//   path: string
//   query: object
//   dataList: object[]
// }) {
//   const range = dataList.length
//   for (let idx = 0; idx < range; idx++) {
//     const response = await chai
//       .request(server)
//       .post(path)
//       .send(dataList[idx])
//       .auth(token, { type: 'bearer' })
//       .query(query)
//     response.should.have.status(CREATED)
//     // Check that the response contains the product id
//     if (!isValidProductId(response.body))
//       throw new BadRequestError(
//         'Product Id is the expected response after a product is created',
//       )
//     yield response.body
//   }
// }
//
export const testPostProduct = (<TestRequestWithQParamsAndBody>testRoutes)({
  statusCode: CREATED,
  verb: 'post',
  validateTestReqData: isValidProductRequestData,
  validateTestResData: isValidProductResponseData,
})

export const testGetAllProducts = (<TestRequestWithQParams>testRoutes)({
  statusCode: OK,
  verb: 'get',
  validateTestResData: isValidProductGETAllResponseData,
})

export const testGetProduct = (<TestRequestWithQParams>testRoutes)({
  statusCode: OK,
  verb: 'get',
  validateTestResData: isValidProductGETResponseData,
})

export const testUpdateProduct = (<TestRequestWithQParamsAndBody>testRoutes)({
  statusCode: OK,
  verb: 'patch',
  validateTestReqData: isValidProductRequestData,
  validateTestResData: isValidProductResponseData,
})

export const testDeleteProduct = (<TestRequestWithQParams>testRoutes)({
  statusCode: OK,
  verb: 'delete',
  validateTestResData: isValidProductResponseData,
})

export const testGetNonExistentProduct = (<TestRequestWithQParams>testRoutes)({
  verb: 'get',
  statusCode: NOT_FOUND,
  validateTestResData: null,
})

export const testUploadProductMedia = async function (
  server: string,
  urlPath: string,
  files: ProductMedia[],
  userInfo: UserRequestData,
  queryParams: { [k: string]: any },
): Promise<any> {
  const token = await signInForTesting(userInfo)
  const fieldName = 'product-media'
  const request = chai
    .request(server)
    .post(urlPath)
    .auth(token, { type: 'bearer' })
    .query(queryParams)
  await Promise.all(
    files.map(async (file) => {
      const data = await readFile(file.path)
      request.attach(fieldName, data, file.name)
    }),
  )

  const descriptions = files.reduce((acc: { [k: string]: any }, file) => {
    acc[file.name] = file.description
    return acc
  }, {})

  const isDisplayImage = files.reduce((acc: { [k: string]: any }, file) => {
    acc[file.name] = file.is_display_image
    return acc
  }, {})

  const isLandingImage = files.reduce((acc: { [k: string]: any }, file) => {
    acc[file.name] = file.is_landing_image
    return acc
  }, {})

  const isVideo = files.reduce((acc: { [k: string]: any }, file) => {
    acc[file.name] = file.is_video
    return acc
  }, {})

  request.field('descriptions', JSON.stringify(descriptions))
  request.field('is_display_image', JSON.stringify(isDisplayImage))
  request.field('is_landing_image', JSON.stringify(isLandingImage))
  request.field('is_video', JSON.stringify(isVideo))

  const response = await request
  response.should.have.status(CREATED)
  // Check the data in the body if accurate
  checkMedia(response.body)
  return response.body
}

async function checkMedia(body: any) {
  body.should.be.an('array')
  body[0].should.be.an('object')
  body[0].should.have.property('filename')
  body[0].should.have.property('filepath')
  body[0].should.have.property('is_display_image')
  body[0].should.have.property('is_landing_image')
  body[0].should.have.property('is_video')
}
