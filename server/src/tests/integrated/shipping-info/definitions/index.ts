import { StatusCodes } from 'http-status-codes'
import {
  isValidShippingInfoId,
  isValidShippingInfoRequest,
  isValidShippingInfoResponse,
  isValidShippingInfoResponseList,
} from '../../../../types/shipping-info.js'
import testRequest from '../../test-request/index.js'
import { TestRequestWithBody, TestRequest } from '../../test-request/types.js'

const { CREATED, OK, NOT_FOUND } = StatusCodes

const testCreateShipping = (testRequest as TestRequestWithBody)({
  verb: 'post',
  statusCode: CREATED,
  validateTestReqData: isValidShippingInfoRequest,
  validateTestResData: isValidShippingInfoId,
})

const testGetAllShipping = (testRequest as TestRequest)({
  statusCode: OK,
  verb: 'get',
  validateTestResData: isValidShippingInfoResponseList,
})

const testGetShipping = (testRequest as TestRequest)({
  statusCode: OK,
  verb: 'get',
  validateTestResData: isValidShippingInfoResponse,
})

const testUpdateShipping = (testRequest as TestRequestWithBody)({
  statusCode: OK,
  verb: 'put',
  validateTestReqData: isValidShippingInfoRequest,
  validateTestResData: isValidShippingInfoId,
})

const testDeleteShipping = (testRequest as TestRequest)({
  statusCode: OK,
  verb: 'delete',
  validateTestResData: isValidShippingInfoId,
})

const testGetNonExistentShipping = (testRequest as TestRequest)({
  verb: 'get',
  statusCode: NOT_FOUND,
  validateTestResData: null,
})

export {
  testCreateShipping,
  testGetAllShipping,
  testGetShipping,
  testUpdateShipping,
  testDeleteShipping,
  testGetNonExistentShipping,
}
