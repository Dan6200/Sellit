import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { TestRequestWithBody } from '../../../../../types-and-interfaces/test-routes.js'
import { isValidVendorId } from '../../../../../types-and-interfaces/users/vendors.js'
import testRoute from '../../../test-route/index.js'
import { isValidSignInInfo } from '@/types-and-interfaces/users/test.js'
chai.use(chaiHttp).should()

const testPostVendor = (testRoute as TestRequestWithBody)({
  verb: 'post',
  statusCode: StatusCodes.CREATED,
  validateReqData: isValidSignInInfo,
  validateResData: isValidVendorId,
})

const testDeleteVendor = (<TestRequestWithBody>testRoute)({
  verb: 'delete',
  statusCode: StatusCodes.NO_CONTENT,
  validateReqData: isValidSignInInfo,
  validateResData: isValidVendorId,
})

export { testPostVendor, testDeleteVendor }
