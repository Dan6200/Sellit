import { StatusCodes } from 'http-status-codes'
import InternalServerError from './internal-server.js'

class BadRequestError extends InternalServerError {
  name: string
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.BAD_REQUEST
    this.name = 'BadRequestError'
  }
}

export default BadRequestError
