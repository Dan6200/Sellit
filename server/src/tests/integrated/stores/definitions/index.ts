import { StatusCodes } from 'http-status-codes'
import {
  isValidStoreDataId,
  isValidStoreDataRequest,
  isValidStoreDataResponse,
  isValidStoreDataResponseList,
} from '../../../../types/store-data.js'
import testRequest from '../../test-request/index.js'
import { TestRequestWithBody, TestRequest } from '../../test-request/types.js'

const { CREATED, OK, NOT_FOUND } = StatusCodes

const testCreateStore = (testRequest as TestRequestWithBody)({
  verb: 'post',
  statusCode: CREATED,
  validateTestReqData: isValidStoreDataRequest,
  validateTestResData: isValidStoreDataId,
})

const testGetAllStore = (testRequest as TestRequest)({
  statusCode: OK,
  verb: 'get',
  validateTestResData: isValidStoreDataResponseList,
})

const testGetStore = (testRequest as TestRequest)({
  statusCode: OK,
  verb: 'get',
  validateTestResData: isValidStoreDataResponse,
})

const testUpdateStore = (testRequest as TestRequestWithBody)({
  statusCode: OK,
  verb: 'put',
  validateTestReqData: isValidStoreDataRequest,
  validateTestResData: isValidStoreDataId,
})

const testDeleteStore = (testRequest as TestRequest)({
  statusCode: OK,
  verb: 'delete',
  validateTestResData: isValidStoreDataId,
})

const testGetNonExistentStore = (testRequest as TestRequest)({
  verb: 'get',
  statusCode: NOT_FOUND,
  validateTestResData: null,
})

export {
  testCreateStore,
  testGetAllStore,
  testGetStore,
  testUpdateStore,
  testDeleteStore,
  testGetNonExistentStore,
}
