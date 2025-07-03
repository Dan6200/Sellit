import { StatusCodes } from 'http-status-codes'
import {
  ProcessRoute,
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../types-and-interfaces/process-routes.js'
import createRouteProcessor from '../routes/process.js'
import { knex, pg } from '../../db/index.js'
import { QueryResult, QueryResultRow } from 'pg'
import { isSuccessful } from '../utils/query-validation.js'
import { validateReqData } from '../utils/request-validation.js'
import { validateResData } from '../utils/response-validation/index.js'
import { getUserInformationAndRole } from './utils.js'
import {
  UIDSchema,
  UserResponseSchema,
  UserUpdateRequestSchema,
} from '../../app-schema/users.js'
import { supabase } from '#supabase-config'
import { UserRequestData } from '@/types-and-interfaces/users/index.js'

const { OK } = StatusCodes

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

  const {
    data: { user },
    error,
  } = await supabase.auth.admin.updateUserById(uid, updateData)
  if (error) throw error
  return (
    await knex.select('uid').from('public.users').where('uid', user.id)
  )?.[0]
}

/**
 * @description Delete the user account from the database
 **/
const deleteQuery = async <T>({ uid }: QueryParams<T>): Promise<typeof uid> => {
  await supabase.auth.admin.deleteUser(uid, true)
  return uid
}

const processPatchRoute = <ProcessRoute>createRouteProcessor
const processDeleteRoute = <ProcessRouteWithoutBody>createRouteProcessor
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
  validateResult: isSuccessful(UIDSchema),
})

export const deleteUser = processDeleteRoute({
  Query: deleteQuery,
  status: OK,
  validateResult: isSuccessful(UIDSchema),
})
