import chai from 'chai'
import BadRequestError from '../../../errors/bad-request.js'
import { TestRequestParamsGeneral } from '../../../types-and-interfaces/test-routes.js'
import { createUserAndSignInForTesting } from './create-user.js'

export default function ({
  verb,
  statusCode,
  validateResData,
  validateReqData,
}: TestRequestParamsGeneral) {
  return async function <T>({
    server,
    token,
    path,
    query,
    body,
  }: {
    server: string
    token: string
    path: string
    query?: { [k: string]: any }
    body?: T
  }) {
    // Validate the request body
    if (body && !validateReqData)
      throw new BadRequestError('Must validate request data')
    if (validateReqData && !validateReqData(body))
      throw new BadRequestError('Invalid Request Data')

    // create a user and sign-in to retrieve token
    if (!query?.public) {
      token = await createUserAndSignInForTesting(body as any)
      console.log('DEBUG: token->' + token)
    }

    // Make request
    const request = chai
      .request(server)
      [verb](path)
      .query(query ?? {})
      .send(<object>body)

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
