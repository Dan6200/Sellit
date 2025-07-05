import { StatusCodes } from 'http-status-codes'
import {
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../../types-and-interfaces/process-routes.js'
import createRouteProcessor from '../../routes/process.js'
import { VendorSchemaID } from '../../../app-schema/vendors.js'
import { validateResData } from '@/controllers/utils/response-validation.js'
import { knex } from '@/db/index.js'
import { Knex } from 'knex'

const { CREATED, NO_CONTENT } = StatusCodes

/**
 * @description Add a vendor account to the database
 **/
const createQuery = async ({
  userId: vendorId,
}: QueryParams): Promise<Knex.QueryBuilder> =>
  knex('vendors').insert({ vendor_id: vendorId }).returning('vendor_id')

/**
 * @description Delete the vendor account from the database
 **/
const deleteQuery = async ({
  userId: vendorId,
}: QueryParams): Promise<Knex.QueryBuilder> =>
  knex('vendors').where('vendor_id', vendorId).del().returning('vendor_id')

const processPostRoute = <ProcessRouteWithoutBody>createRouteProcessor
const processDeleteRoute = <ProcessRouteWithoutBody>createRouteProcessor

export const postVendor = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateResult: validateResData(VendorSchemaID),
})

export const deleteVendor = processDeleteRoute({
  Query: deleteQuery,
  status: NO_CONTENT,
  validateResult: validateResData(VendorSchemaID),
})
