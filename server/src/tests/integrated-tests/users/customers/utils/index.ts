import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { TestRequestWithBody } from '../../../../../types-and-interfaces/test-routes.js'
import { isValidCustomerId } from '../../../../../types-and-interfaces/users/customers.js'
import testRoutes from '../../../test-route/index.js'
import { isValidSignInInfo } from '@/types-and-interfaces/users/test.js'

chai.use(chaiHttp).should()

const testPostCustomer = (<TestRequestWithBody>testRoutes)({
  verb: 'post',
  statusCode: StatusCodes.CREATED,
  validateReqData: isValidSignInInfo,
  validateResData: isValidCustomerId,
})

const testDeleteCustomer = (<TestRequestWithBody>testRoutes)({
  verb: 'delete',
  statusCode: StatusCodes.OK,
  validateReqData: isValidSignInInfo,
  validateResData: isValidCustomerId,
})

export { testPostCustomer, testDeleteCustomer }
