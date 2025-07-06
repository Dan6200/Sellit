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

    // Make request
    const request = chai
      .request(server)
      [verb](path)
      .query(query ?? {})
      .send(<object>requestBody)

    console.log('DEBUG: request ->' + JSON.stringify(request))

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
      // if (response.status === 404) return null
      throw new Error('Invalid Database Result')
    }

    return response.body
  }
}
