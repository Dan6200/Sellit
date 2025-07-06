import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { TestRequest } from '../../../types/test-request.js'
import { isValidVendorId } from '../../../../../types/users/vendors.js'
import testRequest from '../../../test-request/index.js'
chai.use(chaiHttp).should()

const testPostVendor = (testRequest as TestRequest)({
  verb: 'post',
  statusCode: StatusCodes.CREATED,
  validateTestResData: isValidVendorId,
})

const testDeleteVendor = (<TestRequest>testRequest)({
  verb: 'delete',
  statusCode: StatusCodes.NO_CONTENT,
  validateTestResData: isValidVendorId,
})

export { testPostVendor, testDeleteVendor }
