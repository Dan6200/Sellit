import { StatusCodes } from 'http-status-codes'
import {
  isValidStoreDataId,
  isValidStoreDataRequest,
  isValidStoreDataResponse,
  isValidStoreDataResponseList,
} from '../../../../types/store-data.js'
import testRequest from '../../test-request/index.js'
import { TestRequestWithBody, TestRequest } from '../../test-request/types.js'

const { CREATED, OK, NOT_FOUND, FORBIDDEN } = StatusCodes

export const testCreateStore = (testRequest as TestRequestWithBody)({
  verb: 'post',
  statusCode: CREATED,
  validateTestReqData: isValidStoreDataRequest,
  validateTestResData: isValidStoreDataId,
})

export const testGetAllStores = (testRequest as TestRequest)({
  statusCode: OK,
  verb: 'get',
  validateTestResData: isValidStoreDataResponseList,
})

export const testGetStore = (testRequest as TestRequest)({
  statusCode: OK,
  verb: 'get',
  validateTestResData: isValidStoreDataResponse,
})

export const testUpdateStore = (testRequest as TestRequestWithBody)({
  statusCode: OK,
  verb: 'put',
  validateTestReqData: isValidStoreDataRequest,
  validateTestResData: isValidStoreDataId,
})

export const testDeleteStore = (testRequest as TestRequest)({
  statusCode: OK,
  verb: 'delete',
  validateTestResData: isValidStoreDataId,
})

export const testGetNonExistentStore = (testRequest as TestRequest)({
  verb: 'get',
  statusCode: NOT_FOUND,
  validateTestResData: null,
})

export const testCreateStoreWithoutVendorAccount = (
  testRequest as TestRequestWithBody
)({
  verb: 'post',
  statusCode: FORBIDDEN,
  validateTestReqData: isValidStoreDataRequest,
})

export const testUpdateStoreWithoutVendorAccount = (
  testRequest as TestRequestWithBody
)({
  statusCode: FORBIDDEN,
  verb: 'put',
  validateTestReqData: isValidStoreDataRequest,
})

export const testDeleteStoreWithoutVendorAccount = (testRequest as TestRequest)(
  {
    statusCode: FORBIDDEN,
    verb: 'delete',
  },
)
