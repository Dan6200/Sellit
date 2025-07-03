import { ArraySchema, ObjectSchema } from 'joi'
import { QueryResult, QueryResultRow } from 'pg'
import BadRequestError from '../../errors/bad-request.js'
import NotFoundError from '../../errors/not-found.js'
import { isTypeQueryResultRow } from '../../types-and-interfaces/response.js'

/**
 * @description Checks to see if the postgresql query was successful
 * throws a BadRequestError if it is not
 * */
export const isSuccessful =
  <T>(schema: ObjectSchema<T>) =>
  (result: any[] | QueryResult<QueryResultRow | QueryResultRow[]>): boolean => {
    if (isTypeQueryResultRow(result)) {
      if (result.rows.length === 0)
        throw new BadRequestError(`${result.command} Operation unsuccessful`)
      if (result.rows.length > 1)
        throw new BadRequestError(`${result.command} operated erroneously`)
      const { error } = schema.validate(result.rows[0])
      if (error)
        throw new BadRequestError(`${result.command} Operation unsuccessful`)
    } else {
      if (Array.isArray(result) && result.length === 0)
        throw new BadRequestError(`Operation unsuccessful`)
    }
    return true
  }
