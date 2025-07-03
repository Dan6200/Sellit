import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { TestRequest } from '../../../../../types-and-interfaces/test-routes.js'
import { isValidVendorId } from '../../../../../types-and-interfaces/users/vendors.js'
import testRoute from '../../../test-route/index.js'
chai.use(chaiHttp).should()

const testPostVendor = (testRoute as TestRequest)({
  verb: 'post',
  statusCode: StatusCodes.CREATED,
  validateResData: isValidVendorId,
})

const testDeleteVendor = testRoute({
  verb: 'delete',
  statusCode: StatusCodes.OK,
  validateResData: isValidVendorId,
})

export { testPostVendor, testDeleteVendor }
