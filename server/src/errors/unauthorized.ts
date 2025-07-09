import { StatusCodes } from 'http-status-codes'
import InternalServerError from './internal-server.js'

class UnauthorizedError extends InternalServerError {
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
    this.name = 'UnauthorizedError'
  }
}

export default UnauthorizedError
