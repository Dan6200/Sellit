import { StatusCodes } from 'http-status-codes'
import GeneralAPIError from './general-api.js'

class UnauthorizedError extends GeneralAPIError {
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
    this.name = 'UnauthorizedError'
  }
}

export default UnauthorizedError
