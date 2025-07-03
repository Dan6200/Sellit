import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { TestRequest } from '../../../../../types-and-interfaces/test-routes.js'
import { isValidCustomerId } from '../../../../../types-and-interfaces/users/customers.js'
import testRoute from '../../../test-route/index.js'

chai.use(chaiHttp).should()

const testPostCustomer = (<TestRequest>testRoute)({
  verb: 'post',
  statusCode: StatusCodes.CREATED,
  validateResData: isValidCustomerId,
})

const testDeleteCustomer = (<TestRequest>testRoute)({
  verb: 'delete',
  statusCode: StatusCodes.OK,
  validateResData: isValidCustomerId,
})

export { testPostCustomer, testDeleteCustomer }
