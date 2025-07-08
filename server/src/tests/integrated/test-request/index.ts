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

    process.env.DEBUG &&
      console.log('\nDEBUG: request ->' + JSON.stringify(request) + '\n')

    // Add request token
    if (token) request.auth(token, { type: 'bearer' })
    const response = await request

    process.env.DEBUG &&
      console.log('\nDEBUG: response ->' + JSON.stringify(response) + '\n')
    response.should.have.status(statusCode)

    // Validate the response body
    if (
      response.body &&
      validateTestResData &&
      !validateTestResData(response.body)
    ) {
      console.log(validateTestResData.name)
      if (response.status === 404) return null
      throw new Error('Invalid Database Result')
    }

    return response.body
  }
}
