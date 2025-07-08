import { Response } from 'express'
import { RequestWithPayload } from '../../types/request.js'
import { isTypeQueryResultRow, Status } from '../../types/response.js'
import { QueryDB } from '../../types/process-routes.js'
import BadRequestError from '../../errors/bad-request.js'
import { QueryResult, QueryResultRow } from 'pg'
import NotFoundError from '../../errors/not-found.js'
import GeneralAPIError from '@/errors/general-api.js'
import UnauthorizedError from '@/errors/unauthorized.js'

export default ({
  Query,
  QueryForwarder,
  status,
  validateBody,
  validateResult,
}: {
  Query: QueryDB
  QueryForwarder?: (s: string) => QueryDB
  status: Status
  validateBody?: <T>(body: T) => boolean
  validateResult?: (
    result: any[] | QueryResult<QueryResultRow | QueryResultRow[]>,
  ) => boolean
}) => {
  // return the route processor middleware
  return async (
    request: RequestWithPayload,
    response: Response,
  ): Promise<Response<any, Record<string, any>> | void> => {
    const { params, query, body } = request
    let userId: string | undefined
    if (request.userId != null) ({ userId } = request)

    try {
      // Validate request data
      if (
        typeof body != 'undefined' &&
        Object.values(body).length !== 0 &&
        validateBody
      ) {
        // validateBody throws error if body is invalid
        validateBody(body)
      }

      let dbResponse: any
      if (QueryForwarder) {
        // Call the correct query handler based on route is public or not
        const publicQuery = <string>query!.public
        dbResponse = await QueryForwarder(publicQuery)({
          userId,
          body,
          params,
          query,
        })
      } else {
        // remove password
        const { password, ...bodyWithoutPassword } = body
        dbResponse = await Query({
          userId,
          body: bodyWithoutPassword,
          params,
          query,
        })
      }

      if (validateResult) {
        process.env.DEBUG &&
          console.log('\nDEBUG: DB Response -> ' + JSON.stringify(dbResponse))
        // validateBody throws error if data is invalid
        // check for errors returns true if response is valid
        if (!validateResult(dbResponse)) {
          if (Query?.name.match(/get/) || QueryForwarder?.name.match(/get/)) {
            if (Array.isArray(dbResponse) && dbResponse.length === 0)
              throw new NotFoundError(
                'The Requested Resource Could not be found',
              )
          }
          // throw new BadRequestError('Invalid Database Response')
        }
        let responseData: any = null
        if (isTypeQueryResultRow(dbResponse)) {
          if (dbResponse.rowCount === 1) responseData = dbResponse.rows[0]
          else responseData = dbResponse.rows
        }
        if (Array.isArray(dbResponse)) {
          if (dbResponse.length === 1) responseData = dbResponse[0]
          else responseData = dbResponse
        }
        return response.status(status).json(responseData)
      }
      response.status(status).end()
    } catch (error) {
      process.env.DEBUG && console.error
      if (error instanceof GeneralAPIError)
        return response.status(error.statusCode).send(error.message)
      throw error
    }
  }
}
