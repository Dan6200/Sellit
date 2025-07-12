import { StatusCodes } from 'http-status-codes'
import createRouteProcessor from '../routes/process.js'
import {
  ProductResponseSchema,
  ProductRequestSchema,
  ProductGETResponseSchema,
  ProductGETAllResponseSchema,
} from '../../app-schema/products.js'
import {
  ProcessRoute,
  ProcessRouteWithoutBody,
  ProcessRouteWithoutBodyAndDBResult,
} from '../../types/process-routes.js'
import { validateReqData } from '../utils/request-validation.js'
import createQuery from './definitions/create-query.js'
import updateQuery from './definitions/update-query.js'
import deleteQuery from './definitions/delete-query.js'
import { validateResData } from '../utils/response-validation.js'
import retrieveQuery from './definitions/retrieve-query/index.js'
import retrieveQueryAll from './definitions/retrieve-query/all.js'

const { CREATED, OK, NO_CONTENT } = StatusCodes

const processPostRoute = <ProcessRoute>createRouteProcessor
const processGetAllRoute = <ProcessRouteWithoutBody>createRouteProcessor
const processGetRoute = <ProcessRouteWithoutBody>createRouteProcessor
const processPutRoute = <ProcessRoute>createRouteProcessor
const processDeleteRoute = <ProcessRouteWithoutBodyAndDBResult>(
  createRouteProcessor
)

const createProduct = processPostRoute({
  Query: createQuery,
  status: CREATED,
  validateBody: validateReqData(ProductRequestSchema),
  validateResult: validateResData(ProductResponseSchema),
})

const getAllProducts = processGetAllRoute({
  Query: retrieveQueryAll,
  status: OK,
  validateResult: validateResData(ProductGETAllResponseSchema),
})

const getProduct = processGetRoute({
  Query: retrieveQuery,
  status: OK,
  validateResult: validateResData(ProductGETResponseSchema),
})

const updateProduct = processPutRoute({
  Query: updateQuery,
  status: OK,
  validateBody: validateReqData(ProductRequestSchema),
  validateResult: validateResData(ProductResponseSchema),
})

const deleteProduct = processDeleteRoute({
  Query: deleteQuery,
  status: NO_CONTENT,
})

export {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
}
