import chai from 'chai'
import { TestRequestParamsGeneral } from './types.js'

export default function ({
  verb,
  statusCode,
  validateTestResData,
  validateTestReqData,
}: TestRequestParamsGeneral) {
  return async function <T>({
    server,
    path,
    query,
    token,
    requestBody,
  }: {
    server: string
    path: string
    token: string
    query?: { [k: string]: any }
    requestBody?: T
  }) {
    // Validate the request body first
    if (requestBody && !validateTestReqData)
      throw new Error('Must validate test request data')
    if (validateTestReqData && !validateTestReqData(requestBody))
      throw new Error('Invalid Test Request Data')

    // let token = null
    // let requestBodyClean = null,
    //   password,
    //   email
    // // create a user and sign-in to retrieve token
    // if (!query?.public) {
    //   // console.log('DEBUG: ' + JSON.stringify(requestBody))
    //   token = await signInForTesting(requestBody as any)
    //   // console.log('DEBUG: token->' + token)
    //   /* Remove sign-in info after signing-in... */
    //   if (path == '/v1/users')
    //     ({ password, ...requestBodyClean } = requestBody as any)
    //   else ({ email, password, ...requestBodyClean } = requestBody as any)
    // }

    // Make request
    const request = chai
      .request(server)
      [verb](path)
      .query(query ?? {})
      .send(<object>requestBody)

    // Add request token
    if (token) request.auth(token, { type: 'bearer' })
    const response = await request
    response.should.have.status(statusCode)

    // Validate the response body
    if (
      response.body &&
      validateTestResData &&
      !validateTestResData(response.body)
    ) {
      if (response.status === 404) return null
      throw new Error('Invalid Database Result')
    }

    return response.body
  }
}
