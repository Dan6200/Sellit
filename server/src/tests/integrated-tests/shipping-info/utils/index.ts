import { StatusCodes } from 'http-status-codes'
import {
  isValidShippingInfoId,
  isValidShippingInfoRequest,
  isValidShippingInfoResponse,
  isValidShippingInfoResponseList,
} from '../../../../types-and-interfaces/shipping-info.js'
import {
  TestRequest,
  TestRequestWithBody,
} from '../../../../types-and-interfaces/test-routes.js'
import testRoute from '../../test-route/index.js'

const { CREATED, OK, NOT_FOUND } = StatusCodes

const testCreateShipping = (testRoute as TestRequestWithBody)({
  verb: 'post',
  statusCode: CREATED,
  validateReqData: isValidShippingInfoRequest,
  validateResData: isValidShippingInfoId,
})

const testGetAllShipping = (testRoute as TestRequest)({
  statusCode: OK,
  verb: 'get',
  validateResData: isValidShippingInfoResponseList,
})

const testGetShipping = (testRoute as TestRequest)({
  statusCode: OK,
  verb: 'get',
  validateResData: isValidShippingInfoResponse,
})

const testUpdateShipping = (testRoute as TestRequestWithBody)({
  statusCode: OK,
  verb: 'put',
  validateReqData: isValidShippingInfoRequest,
  validateResData: isValidShippingInfoId,
})

const testDeleteShipping = (testRoute as TestRequest)({
  statusCode: OK,
  verb: 'delete',
  validateResData: isValidShippingInfoId,
})

const testGetNonExistentShipping = (testRoute as TestRequest)({
  verb: 'get',
  statusCode: NOT_FOUND,
  validateResData: null,
})

export {
  testCreateShipping,
  testGetAllShipping,
  testGetShipping,
  testUpdateShipping,
  testDeleteShipping,
  testGetNonExistentShipping,
}
