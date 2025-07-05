import { StatusCodes } from 'http-status-codes'
import {
  ProcessRoute,
  ProcessRouteWithoutBody,
  ProcessRouteWithoutBodyAndDBResult,
  QueryParams,
} from '../../types-and-interfaces/process-routes.js'
import createRouteProcessor from '../routes/process.js'
import { QueryResult, QueryResultRow } from 'pg'
import { validateReqData } from '../utils/request-validation.js'
import { validateResData } from '../utils/response-validation.js'
import { getUserInformationAndRole } from './utils.js'
import {
  UserResponseSchema,
  UserUpdateRequestSchema,
} from '../../app-schema/users.js'
import { supabase } from '#supabase-config'
import { pg } from '@/db/index.js'
import { UserRequestData } from '@/types-and-interfaces/users/index.js'

const { OK, NO_CONTENT } = StatusCodes

/**
 * @description Retrieves user information.
 * Also returns if it's a vendor or a customer or both
 **/
const getQuery = async <T>({
  uid,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> =>
  pg.query(getUserInformationAndRole, [uid])

/**
 * @description Updates user information.
 **/
const updateQuery = async <T>({
  body,
  uid,
}: QueryParams<T>): Promise<QueryResult<QueryResultRow>> => {
  const { email, password, ...user_metadata } = <UserRequestData>(<any>body)

  const updateData: {
    email?: string
    password?: string
    user_metadata?: object
    email_confirm?: boolean
  } = {}

  if (email !== undefined) {
    updateData.email = email
  }
  if (password !== undefined) {
    updateData.password = password
  }
  if (user_metadata && Object.keys(user_metadata).length > 0) {
    updateData.user_metadata = user_metadata
  }
  updateData.email_confirm = true

  const { error } = await supabase.auth.admin.updateUserById(uid, updateData)
  if (error) throw error
  return pg.query(getUserInformationAndRole, [uid])
}

/**
 * @description Delete the user account from the database
 **/
/* TODO: Add soft delete option */
const deleteQuery = async <T>({ uid }: QueryParams<T>): Promise<void> => {
  await supabase.auth.admin.deleteUser(uid)
}

const processPatchRoute = <ProcessRoute>createRouteProcessor
const processDeleteRoute = <ProcessRouteWithoutBodyAndDBResult>(
  createRouteProcessor
)
const processGetRoute = <ProcessRouteWithoutBody>createRouteProcessor

export const getUser = processGetRoute({
  Query: getQuery,
  status: OK,
  validateResult: validateResData(UserResponseSchema),
})

export const patchUser = processPatchRoute({
  Query: updateQuery,
  status: OK,
  validateBody: validateReqData(UserUpdateRequestSchema),
  validateResult: validateResData(UserResponseSchema),
})

export const deleteUser = processDeleteRoute({
  Query: deleteQuery,
  status: NO_CONTENT,
})
