import { StatusCodes } from 'http-status-codes'
import GeneralAPIError from './general-api.js'

class NotFoundError extends GeneralAPIError {
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.NOT_FOUND
    this.name = 'NotFoundError'
  }
}

export default NotFoundError
