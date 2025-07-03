import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import {
  TestCreateRequest,
  TestCreateRequestWithBody,
} from '../../../../types-and-interfaces/test-routes.js'
import {
  isValidUID,
  isValidUserRequestData,
  isValidUserResponseData,
  isValidUserUpdateRequestData,
} from '../../../../types-and-interfaces/users/index.js'
import testCreateRequest from '../../test-route/index.js'

chai.use(chaiHttp).should()

const { OK, NOT_FOUND, CREATED, UNAUTHORIZED } = StatusCodes

const hasNoCustomerAccount = (data: unknown) => {
  const isValidData = isValidUserResponseData(data)
  if (!isValidData) throw new Error('Invalid User Data Response')
  data.is_customer.should.be.false
  return true
}

const hasCustomerAccount = (data: unknown) => {
  const isValidData = isValidUserResponseData(data)
  if (!isValidData) throw new Error('Invalid User Data Response')
  data.is_customer.should.be.true
  return true
}

const hasVendorAccount = (data: unknown) => {
  const isValidData = isValidUserResponseData(data)
  if (!isValidData) throw new Error('Invalid User Data Response')
  data.is_vendor.should.be.true
  return true
}

const hasNoVendorAccount = (data: unknown) => {
  const isValidData = isValidUserResponseData(data)
  if (!isValidData) throw new Error('Invalid User Data Response')
  data.is_vendor.should.be.false
  return true
}

export const testFailToGetUser = (<TestCreateRequest>testCreateRequest)({
  verb: 'get',
  statusCode: UNAUTHORIZED,
  validateResData: null,
})

export const testGetUser = (testCreateRequest as TestCreateRequest)({
  verb: 'get',
  statusCode: OK,
  validateResData: isValidUserResponseData,
})

export const testHasCustomerAccount = (<TestCreateRequest>testCreateRequest)({
  verb: 'get',
  statusCode: OK,
  validateResData: hasCustomerAccount,
})

export const testHasNoCustomerAccount = (<TestCreateRequest>testCreateRequest)({
  verb: 'get',
  statusCode: OK,
  validateResData: hasNoCustomerAccount,
})

export const testHasVendorAccount = (<TestCreateRequest>testCreateRequest)({
  verb: 'get',
  statusCode: OK,
  validateResData: hasVendorAccount,
})

export const testHasNoVendorAccount = (<TestCreateRequest>testCreateRequest)({
  verb: 'get',
  statusCode: OK,
  validateResData: hasNoVendorAccount,
})

export const testPostUser = (<TestCreateRequestWithBody>testCreateRequest)({
  verb: 'post',
  statusCode: CREATED,
  validateResData: isValidUID,
  validateReqData: isValidUserRequestData,
})

export const testPatchUser = testCreateRequest({
  verb: 'patch',
  statusCode: OK,
  validateResData: isValidUID,
  validateReqData: isValidUserUpdateRequestData,
})

export const testDeleteUser = testCreateRequest({
  verb: 'delete',
  statusCode: OK,
  validateResData: isValidUID,
})

export const testGetNonExistentUser = testCreateRequest({
  verb: 'get',
  statusCode: NOT_FOUND,
  validateResData: null,
})
