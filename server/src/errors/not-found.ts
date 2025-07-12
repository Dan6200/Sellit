import { StatusCodes } from 'http-status-codes'
import InternalServerError from './internal-server.js'

class NotFoundError extends InternalServerError {
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.NOT_FOUND
    this.name = 'NotFoundError'
  }
}

export default NotFoundError
