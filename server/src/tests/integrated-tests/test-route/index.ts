import chai from 'chai'
import BadRequestError from '../../../errors/bad-request.js'
import { TestRequestParamsGeneral } from '../../../types-and-interfaces/test-routes.js'
import { signInForTesting } from './signin-user.js'

export default function ({
  verb,
  statusCode,
  validateResData,
  validateReqData,
}: TestRequestParamsGeneral) {
  return async function <T>({
    server,
    path,
    query,
    requestBody,
  }: {
    server: string
    path: string
    query?: { [k: string]: any }
    requestBody?: T
  }) {
    let token = null
    // create a user and sign-in to retrieve token
    if (!query?.public) {
      // console.log('DEBUG: ' + JSON.stringify(requestBody))
      token = await signInForTesting(requestBody as any)
      // console.log('DEBUG: token->' + token)
    }
    const { password, ...requestBodyWithoutPasswd } = requestBody as any

    // Validate the request body
    if (requestBodyWithoutPasswd && !validateReqData)
      throw new BadRequestError('Must validate request data')
    if (validateReqData && !validateReqData(requestBodyWithoutPasswd))
      throw new BadRequestError('Invalid Request Data')

    // Make request
    const request = chai
      .request(server)
      [verb](path)
      .query(query ?? {})
      .send(<object>requestBodyWithoutPasswd)

    // Add request token
    if (token) request.auth(token, { type: 'bearer' })
    const response = await request
    response.should.have.status(statusCode)

    // Validate the response body
    if (response.body && validateResData && !validateResData(response.body)) {
      if (response.status === 404) return null
      throw new BadRequestError('Invalid Database Result')
    }

    return response.body
  }
}
