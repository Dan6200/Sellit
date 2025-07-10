import { ObjectSchema } from 'joi'
import BadRequestError from '../../errors/bad-request.js'

/**
 * @description Validates data against schema
 */
export const validateReqData =
  <T>(schema: ObjectSchema<T>) =>
  (data: unknown) => {
    if (typeof data == 'undefined' || Object.keys(data)?.length === 0)
      throw new BadRequestError('request data cannot be empty')
    const { error } = schema.validate(data)
    if (error) throw new BadRequestError(error.message)
    return true
  }
