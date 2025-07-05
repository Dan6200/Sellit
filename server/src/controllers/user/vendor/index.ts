import { StatusCodes } from 'http-status-codes'
import {
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../../types-and-interfaces/process-routes.js'
import createRouteProcessor from '../../routes/process.js'
import { VendorSchemaID } from '../../../app-schema/vendors.js'
import { supabase } from '#supabase-config'
import { validateResData } from '@/controllers/utils/response-validation.js'

const { CREATED, OK } = StatusCodes

/**
 * @description Add a vendor account to the database
 **/
const createQuery = async <T>({
  uid: vendorId,
}: QueryParams<T>): Promise<typeof vendorId> =>
  supabase.from('vendors').insert({ vendor_id: vendorId }).select('vendor_id')

/**
 * @description Delete the vendor account from the database
 **/
const deleteQuery = async <T>({
  uid: vendorId,
}: QueryParams<T>): Promise<typeof vendorId> =>
  supabase.from('vendors').delete().eq('vendor_id', vendorId)

const processPostRoute = <ProcessRouteWithoutBody>createRouteProcessor
const processDeleteRoute = <ProcessRouteWithoutBody>createRouteProcessor

export const postVendor = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateResult: validateResData(VendorSchemaID),
})

export const deleteVendor = processDeleteRoute({
  Query: deleteQuery,
  status: OK,
  validateResult: validateResData(VendorSchemaID),
})
