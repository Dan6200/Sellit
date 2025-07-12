import { StatusCodes } from 'http-status-codes'
import {
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../types/process-routes.js'
import createRouteProcessor from '../routes/process.js'
import { QueryResult, QueryResultRow } from 'pg'
import { validateResData } from '../utils/response-validation.js'
import { UserResponseSchema } from '../../app-schema/users.js'
import { pg } from '#src/db/index.js'
import UnauthorizedError from '#src/errors/unauthorized.js'

const { OK } = StatusCodes

/**
 * @description Retrieves user information.
 * Also returns if it's a vendor or a customer or both
 **/
const getQuery = async ({
  userId,
}: QueryParams): Promise<QueryResult<QueryResultRow>> => {
  if (!userId) throw new UnauthorizedError('Signin to access user account.')
  return pg.query('select * from users where user_id=$1', [userId])
}

const processGetRoute = <ProcessRouteWithoutBody>createRouteProcessor
export const getProfile = processGetRoute({
  Query: getQuery,
  status: OK,
  validateResult: validateResData(UserResponseSchema),
})
