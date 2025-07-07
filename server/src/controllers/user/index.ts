import { StatusCodes } from 'http-status-codes'
import {
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../types/process-routes.js'
import createRouteProcessor from '../routes/process.js'
import { QueryResult, QueryResultRow } from 'pg'
import { validateResData } from '../utils/response-validation.js'
import { UserResponseSchema } from '../../app-schema/users.js'
import { pg } from '@/db/index.js'

const { OK } = StatusCodes

/**
 * @description Retrieves user information.
 * Also returns if it's a vendor or a customer or both
 **/
const getQuery = async ({
  userId,
}: QueryParams): Promise<QueryResult<QueryResultRow>> =>
  pg.query('select * from users where user_id=$1', [userId])

/* TODO: MOVE TO CLIENT!!!... */
// /**
//  * @description Updates user information.
//  **/
// const updateQuery = async ({
//   body,
//   userId,
// }: QueryParams): Promise<QueryResult<QueryResultRow>> => {
//   const { email, password, ...user_metadata } = <UserRequestData>(<any>body)
//
//   const updateData: {
//     email?: string
//     password?: string
//     user_metadata?: object
//     email_confirm?: boolean
//   } = {}
//
//   if (email !== undefined) {
//     updateData.email = email
//   }
//   if (password !== undefined) {
//     updateData.password = password
//   }
//   if (user_metadata && Object.keys(user_metadata).length > 0) {
//     updateData.user_metadata = user_metadata
//   }
//   updateData.email_confirm = true
//
//   const { error } = await supabase.auth.admin.updateUserById(userId, updateData)
//   if (error) throw error
//   return pg.query(getUserInformationAndRole, [userId])
// }
//
// /**
//  * @description Delete the user account from the database
//  **/
// /* TODO: Add soft delete option */
// const deleteQuery = async ({ userId }: QueryParams): Promise<void> => {
//   await supabase.auth.admin.deleteUser(userId)
// }
//
// const processPatchRoute = <ProcessRoute>createRouteProcessor
// const processDeleteRoute = <ProcessRouteWithoutBodyAndDBResult>(
//   createRouteProcessor
// )
//
// export const patchUser = processPatchRoute({
//   Query: updateQuery,
//   status: OK,
//   validateBody: validateReqData(UserUpdateRequestSchema),
//   validateResult: validateResData(UserResponseSchema),
// })
//
// export const deleteUser = processDeleteRoute({
//   Query: deleteQuery,
//   status: NO_CONTENT,
// })

const processGetRoute = <ProcessRouteWithoutBody>createRouteProcessor
export const getUser = processGetRoute({
  Query: getQuery,
  status: OK,
  validateResult: validateResData(UserResponseSchema),
})
