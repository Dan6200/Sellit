import { StatusCodes } from 'http-status-codes'
import {
  isValidDeliveryInfoId,
  isValidDeliveryInfoRequest,
  isValidDeliveryInfoResponse,
  isValidDeliveryInfoResponseList,
} from '../../../../types/delivery-info.js'
import testRequest from '../../test-request/index.js'
import { TestRequestWithBody, TestRequest } from '../../test-request/types.js'

const { CREATED, OK, NOT_FOUND } = StatusCodes

const testCreateDelivery = (testRequest as TestRequestWithBody)({
  verb: 'post',
  statusCode: CREATED,
  validateTestReqData: isValidDeliveryInfoRequest,
  validateTestResData: isValidDeliveryInfoId,
})

const testGetAllDelivery = (testRequest as TestRequest)({
  statusCode: OK,
  verb: 'get',
  validateTestResData: isValidDeliveryInfoResponseList,
})

const testGetDelivery = (testRequest as TestRequest)({
  statusCode: OK,
  verb: 'get',
  validateTestResData: isValidDeliveryInfoResponse,
})

const testUpdateDelivery = (testRequest as TestRequestWithBody)({
  statusCode: OK,
  verb: 'put',
  validateTestReqData: isValidDeliveryInfoRequest,
  validateTestResData: isValidDeliveryInfoId,
})

const testDeleteDelivery = (testRequest as TestRequest)({
  statusCode: OK,
  verb: 'delete',
  validateTestResData: isValidDeliveryInfoId,
})

const testGetNonExistentDelivery = (testRequest as TestRequest)({
  verb: 'get',
  statusCode: NOT_FOUND,
  validateTestResData: null,
})

export {
  testCreateDelivery,
  testGetAllDelivery,
  testGetDelivery,
  testUpdateDelivery,
  testDeleteDelivery,
  testGetNonExistentDelivery,
}
