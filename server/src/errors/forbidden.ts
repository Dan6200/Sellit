import { StatusCodes } from 'http-status-codes'
import GeneralAPIError from './general-api.js'

class ForbiddenError extends GeneralAPIError {
  name: string
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.FORBIDDEN
    this.name = 'ForbiddenError'
  }
}

export default ForbiddenError
