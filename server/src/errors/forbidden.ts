import { StatusCodes } from 'http-status-codes'
import InternalServerError from './internal-server.js'

class ForbiddenError extends InternalServerError {
  name: string
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.FORBIDDEN
    this.name = 'ForbiddenError'
  }
}

export default ForbiddenError
