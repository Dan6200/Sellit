import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { TestRequest } from '../../../types/test-request.js'
import { isValidCustomerId } from '../../../../../types/users/customers.js'
import testRequests from '../../../test-request/index.js'

chai.use(chaiHttp).should()

const testPostCustomer = (<TestRequest>testRequests)({
  verb: 'post',
  statusCode: StatusCodes.CREATED,
  validateTestResData: isValidCustomerId,
})

const testDeleteCustomer = (<TestRequest>testRequests)({
  verb: 'delete',
  statusCode: StatusCodes.OK,
  validateTestResData: isValidCustomerId,
})

export { testPostCustomer, testDeleteCustomer }
