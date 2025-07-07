import { StatusCodes } from 'http-status-codes'

class GeneralAPIError extends Error {
  statusCode: number
  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    this.name = 'GeneralAPIError'
  }
}

export default GeneralAPIError
