/*
import { StatusCodes } from 'http-status-codes'
import {
  StoreSchemaReqData,
  StoreSchemaReqDataPartial,
  StoreSchemaDBResult,
  StoreSchemaDBResultID,
  StoreSchemaDBResultList,
} from '../../app-schema/stores.js'
import db from '../../db/index.js'
import BadRequestError from '../../errors/bad-request.js'
import UnauthorizedError from '../../errors/unauthorized.js'
import {
  ProcessRoute,
  ProcessRouteWithoutBody,
  QueryParams,
} from '../../types/process-routes.js'
import {
  isValidStoresData,
  StoresData,
} from '../../types/stores-data.js'
import {
  SelectRecord,
  InsertRecord,
  UpdateRecord,
  DeleteRecord,
} from '../helpers/generate-sql-commands/index.js'
import processRoute from '../helpers/process-route.js'
import {
  validateReqData,
  validateResData,
} from '../helpers/query-validation.js'

const createQuery = async <T>({ body, userId: vendorId }: QueryParams<T>) => {
  if (!vendorId) throw new UnauthorizedError('Cannot access resource')
  // check if vendor account exists
  const dbRes = await db.query({
    text: SelectRecord('vendors', ['1'], 'vendor_id=$1'), //'select 1 from vendors where vendor_id=$1',
    values: [vendorId],
  })
  if (dbRes.rows.length === 0)
    throw new BadRequestError(
      'No Vendor account found. Please create a Vendor account'
    )
  let recordsCount = <number>(
    await db.query({
      text: SelectRecord('stores', ['1'], 'vendor_id=$1'),
      values: [vendorId],
    })
  ).rows.length
  // limit amount of stores
  const LIMIT = 5
  // if Over limit throw error
  if (LIMIT <= recordsCount)
    throw new BadRequestError(`Each vendor is limited to only ${LIMIT} stores`)

  if (!isValidStoresData(body)) throw new BadRequestError('Invalid store data')

  const storeData: StoresData = body

  return db.query({
    text: InsertRecord(
      'stores',
      ['vendor_id', ...Object.keys(storeData)],
      'store_id'
    ),
    values: [vendorId, ...Object.values(storeData)],
  })
}

const readAllQuery = async <T>({ userId: vendorId }: QueryParams<T>) => {
  if (!vendorId) throw new UnauthorizedError('Cannot access resource')
  const res = await db.query({
    text: SelectRecord('vendors', ['1'], 'vendor_id=$1'), // 'select 1 from vendors where vendor_id=$1',
    values: [vendorId],
  })
  if (res.rows.length === 0)
    throw new BadRequestError(
      'No Vendor account found. Please create a Vendor account'
    )
  return db.query({
    text: SelectRecord('stores', ['*'], 'vendor_id=$1'),
    values: [vendorId],
  })
}

const readQuery = async <T>({ params, userId: vendorId }: QueryParams<T>) => {
  if (params == null)
    throw new BadRequestError('Must provide route parameters to read resource')
  const { storeId } = params
  if (!vendorId) throw new UnauthorizedError('Cannot access resource')
  const res = await db.query({
    text: SelectRecord('vendors', ['1'], 'vendor_id=$1'), //'select 1 from vendors where vendor_id=$1',
    values: [vendorId],
  })
  if (res.rows.length === 0)
    throw new BadRequestError(
      'No Vendor account found. Please create a Vendor account'
    )
  return db.query({
    text: SelectRecord('stores', ['*'], `store_id=$1`), //`select * from stores where store_id=$1`,
    values: [storeId],
  })
}

const updateQuery = async <T>({
  params,
  body,
  userId: vendorId,
}: QueryParams<T>) => {
  if (params == null)
    throw new BadRequestError(
      'Must provide route parameters to update resource'
    )
  const { storeId } = params
  if (!storeId) throw new BadRequestError('Need Id param to update resource')
  const res = await db.query({
    text: SelectRecord('vendors', ['1'], 'vendor_id=$1'),
    values: [vendorId],
  })
  if (res.rows.length === 0)
    throw new BadRequestError(
      'No Vendor account found. Please create a Vendor account'
    )

  if (!isValidStoresData(body)) throw new BadRequestError('Invalid store data')
  const storeData: StoresData = body

  let fields = Object.keys(storeData),
    data = Object.values(storeData)
  const paramList = [storeId, ...data]
  const condition = `store_id=$1`
  const query = {
    text: UpdateRecord('stores', fields, 2, condition, ['store_id']),
    values: paramList,
  }
  return db.query(query)
}

const deleteQuery = async <T>({ params, userId: vendorId }: QueryParams<T>) => {
  if (params == null)
    throw new BadRequestError(
      'Must provide route parameters to delete resource'
    )
  const { storeId } = params
  const res = await db.query({
    text: 'select vendor_id from vendors where vendor_id=$1',
    values: [vendorId],
  })
  if (res.rows.length === 0)
    throw new BadRequestError(
      'No Vendor account found. Please create a Vendor account'
    )
  return db.query({
    text: DeleteRecord('stores', ['store_id'], 'store_id=$1'),
    values: [storeId],
  })
}

const processPostRoute = <ProcessRoute>processRoute
const createStore = processPostRoute({
  Query: createQuery,
  status: StatusCodes.CREATED,
  validateBody: validateReqData(StoreSchemaReqData),
  validateResult: validateResData(StoreSchemaDBResultID),
})

const processGetAllRoute = <ProcessRouteWithoutBody>processRoute
const getAllStores = processGetAllRoute({
  Query: readAllQuery,
  status: StatusCodes.OK,
  validateResult: validateResData(StoreSchemaDBResultList),
})

const processGetRoute = <ProcessRouteWithoutBody>processRoute
const getStore = processGetRoute({
  Query: readQuery,
  status: StatusCodes.OK,
  validateResult: validateResData(StoreSchemaDBResult),
})

const processPutRoute = <ProcessRoute>processRoute
const updateStore = processPutRoute({
  Query: updateQuery,
  status: StatusCodes.OK,
  validateBody: validateReqData(StoreSchemaReqDataPartial),
  validateResult: validateResData(StoreSchemaDBResultID),
})

const processDeleteRoute = <ProcessRouteWithoutBody>processRoute
const deleteStore = processDeleteRoute({
  Query: deleteQuery,
  status: StatusCodes.OK,
  validateResult: validateResData(StoreSchemaDBResultID),
})

export { createStore, getStore, getAllStores, updateStore, deleteStore }
*/
