import { StatusCodes } from 'http-status-codes'
import GeneralAPIError from './general-api.js'

class BadRequestError extends GeneralAPIError {
  name: string
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.BAD_REQUEST
    this.name = 'BadRequestError'
  }
}

export default BadRequestError
