import { StatusCodes } from 'http-status-codes'

class InternalServerError extends Error {
  statusCode: number
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    this.name = 'InternalServerError'
  }
}

export default InternalServerError
