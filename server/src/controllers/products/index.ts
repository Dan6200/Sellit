import { StatusCodes } from 'http-status-codes'
import createRouteProcessor from '../routes/process.js'
import {
  ProductResponseSchema,
  ProductIdSchema,
  ProductListResponseSchema,
  ProductRequestSchema,
} from '../../app-schema/products.js'
import {
  ProcessRoute,
  ProcessRouteWithForwarder,
  ProcessRouteWithoutBody,
} from '../../types/process-routes.js'
import { validateReqData } from '../utils/request-validation.js'
import {
  getAllQueryForwarder,
  getQueryForwarder,
} from './utils/retrieve-query.js'
import createQuery from './utils/create-query.js'
import updateQuery from './utils/update-query.js'
import deleteQuery from './utils/delete-query.js'
import { validateResData } from '../utils/response-validation.js'

const { CREATED, OK } = StatusCodes

const processPostRoute = <ProcessRoute>createRouteProcessor
const processGetAllRoute = <ProcessRouteWithForwarder>createRouteProcessor
const processGetRoute = <ProcessRouteWithForwarder>createRouteProcessor
const processPutRoute = <ProcessRoute>createRouteProcessor
const processDeleteRoute = <ProcessRouteWithoutBody>createRouteProcessor

//cspell:ignore DBID
const createProduct = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateBody: validateReqData(ProductRequestSchema),
  validateResult: validateResData(ProductIdSchema),
})

const getAllProducts = processGetAllRoute({
  QueryForwarder: getAllQueryForwarder,
  status: OK,
  validateResult: validateResData(ProductListResponseSchema),
})

const getProduct = processGetRoute({
  QueryForwarder: getQueryForwarder,
  status: OK,
  validateResult: validateResData(ProductResponseSchema),
})

const updateProduct = processPutRoute({
  Query: updateQuery,
  status: OK,
  validateBody: validateReqData(ProductRequestSchema),
  validateResult: validateResData(ProductIdSchema),
})

const deleteProduct = processDeleteRoute({
  Query: deleteQuery,
  status: OK,
  validateResult: validateResData(ProductIdSchema),
})

export {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
}
