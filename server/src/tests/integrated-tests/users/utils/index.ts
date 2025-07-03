import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { TestRequestWithBody } from '@/types-and-interfaces/test-routes.js'
import {
  isValidUID,
  isValidUserRequestData,
  isValidUserResponseData,
  isValidUserUpdateRequestData,
} from '@/types-and-interfaces/users/index.js'
import testRequests from '../../test-route/index.js'

chai.use(chaiHttp).should()

const { OK, NOT_FOUND, UNAUTHORIZED } = StatusCodes

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

export const testFailToGetUser = testRequests({
  verb: 'get',
  statusCode: UNAUTHORIZED,
  validateResData: null,
})

const testRequestsWithBody = <TestRequestWithBody>testRequests
export const testGetUser = testRequestsWithBody({
  verb: 'get',
  statusCode: OK,
  validateResData: isValidUserResponseData,
  validateReqData: isValidUserRequestData,
})

export const testHasCustomerAccount = testRequestsWithBody({
  verb: 'get',
  statusCode: OK,
  validateResData: hasCustomerAccount,
  validateReqData: isValidUserRequestData,
})

export const testHasNoCustomerAccount = testRequestsWithBody({
  verb: 'get',
  statusCode: OK,
  validateResData: hasNoCustomerAccount,
  validateReqData: isValidUserRequestData,
})

export const testHasVendorAccount = testRequestsWithBody({
  verb: 'get',
  statusCode: OK,
  validateResData: hasVendorAccount,
  validateReqData: isValidUserRequestData,
})

export const testHasNoVendorAccount = testRequestsWithBody({
  verb: 'get',
  statusCode: OK,
  validateResData: hasNoVendorAccount,
  validateReqData: isValidUserRequestData,
})

export const testPatchUser = testRequests({
  verb: 'patch',
  statusCode: OK,
  validateResData: isValidUID,
  validateReqData: isValidUserUpdateRequestData,
})

export const testDeleteUser = testRequests({
  verb: 'delete',
  statusCode: OK,
  validateResData: isValidUID,
  validateReqData: isValidUserRequestData,
})

export const testGetNonExistentUser = testRequests({
  verb: 'get',
  statusCode: NOT_FOUND,
  validateResData: null,
  validateReqData: isValidUserRequestData,
})
