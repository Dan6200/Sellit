import chai from 'chai'
import BadRequestError from '../../../errors/bad-request.js'
import { TestCreateRequestParamsGeneral } from '../../../types-and-interfaces/test-routes.js'
import { UserRequestData } from '../../../types-and-interfaces/users/index.js'
import { deleteUser } from './delete-user.js'
import { supabase } from '#supabase-config'

export default function ({
  verb,
  statusCode,
  validateResData,
  validateReqData,
}: TestCreateRequestParamsGeneral) {
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

    const userData = body as UserRequestData

    // Create user for testing
    if (verb === 'post' && path === '/v1/users') {
      const { error } = await supabase.auth.admin.createUser({
        ...userData,
        email_confirm: true,
      })
      if (error)
        throw new Error(
          'Unable to create user: ' + userData?.email + '\n\t' + error.cause,
        )
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: userData?.email,
          password: userData?.password,
        })
      if (signInError) throw signInError
      token = signInData.session?.access_token as string
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

    // Delete user for testing
    if (verb === 'delete' && path === '/v1/users') {
      await deleteUser(response.body)
    }

    return response.body
  }
}
