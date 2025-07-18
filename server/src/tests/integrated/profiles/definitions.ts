import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { TestRequest, TestRequestWithQParams } from '../test-request/types.js'
import { isValidProfileResponseData } from './types.js'
import testRequest from '../test-request/index.js'

chai.use(chaiHttp).should()

const { OK, UNAUTHORIZED } = StatusCodes

const hasNoCustomerAccount = (data: unknown) => {
  const isValidData = isValidProfileResponseData(data)
  if (!isValidData) throw new Error('Invalid Profile Data Response')
  data.is_customer.should.be.false
  return true
}

const hasCustomerAccount = (data: unknown) => {
  const isValidData = isValidProfileResponseData(data)
  if (!isValidData) throw new Error('Invalid Profile Data Response')
  data.is_customer.should.be.true
  return true
}

const hasVendorAccount = (data: unknown) => {
  const isValidData = isValidProfileResponseData(data)
  if (!isValidData) throw new Error('Invalid Profile Data Response')
  data.is_vendor.should.be.true
  return true
}

const hasNoVendorAccount = (data: unknown) => {
  const isValidData = isValidProfileResponseData(data)
  if (!isValidData) throw new Error('Invalid Profile Data Response')
  data.is_vendor.should.be.false
  return true
}

const testRequestBase = <TestRequest>testRequest
export const testGetProfile = testRequestBase({
  verb: 'get',
  statusCode: OK,
  validateTestResData: isValidProfileResponseData,
})

export const testHasCustomerAccount = testRequestBase({
  verb: 'get',
  statusCode: OK,
  validateTestResData: hasCustomerAccount,
})

export const testHasNoCustomerAccount = testRequestBase({
  verb: 'get',
  statusCode: OK,
  validateTestResData: hasNoCustomerAccount,
})

export const testHasVendorAccount = testRequestBase({
  verb: 'get',
  statusCode: OK,
  validateTestResData: hasVendorAccount,
})

export const testHasNoVendorAccount = testRequestBase({
  verb: 'get',
  statusCode: OK,
  validateTestResData: hasNoVendorAccount,
})

const testRequestWithoutSignIn = <TestRequestWithQParams>testRequest
export const testGetProfileWithoutSignIn = testRequestWithoutSignIn({
  verb: 'get',
  statusCode: UNAUTHORIZED,
})

export const testHasCustomerAccountWithoutSignIn = testRequestWithoutSignIn({
  verb: 'get',
  statusCode: OK,
  validateTestResData: hasCustomerAccount,
})

/* Can only work for Admin accounts */
// export const testGetNonExistentProfile = testRequests({
//   verb: 'get',
//   statusCode: UNAUTHORIZED,
//   validateTestResData: null,
//   validateTestReqData: isValidProfileRequestData,
// })
