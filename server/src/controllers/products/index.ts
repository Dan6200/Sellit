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
  ProcessRouteWithoutBody,
} from '../../types/process-routes.js'
import { validateReqData } from '../utils/request-validation.js'
import createQuery from './definitions/create-query.js'
import updateQuery from './definitions/update-query.js'
import deleteQuery from './definitions/delete-query.js'
import { validateResData } from '../utils/response-validation.js'
import retrieveQuery from './definitions/retrieve-query/index.js'
import retrieveQueryAll from './definitions/retrieve-query/all.js'

const { CREATED, OK } = StatusCodes

const processPostRoute = <ProcessRoute>createRouteProcessor
const processGetAllRoute = <ProcessRouteWithoutBody>createRouteProcessor
const processGetRoute = <ProcessRouteWithoutBody>createRouteProcessor
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
  Query: retrieveQueryAll,
  status: OK,
  validateResult: validateResData(ProductListResponseSchema),
})

const getProduct = processGetRoute({
  Query: retrieveQuery,
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
