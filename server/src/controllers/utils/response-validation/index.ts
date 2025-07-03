import { ArraySchema, ObjectSchema } from 'joi'
import { QueryResult, QueryResultRow } from 'pg'
import BadRequestError from '../../../errors/bad-request.js'
import NotFoundError from '../../../errors/not-found.js'
import {
  isTypeQueryResultRow,
  isTypeQueryResultRowList,
} from '../../../types-and-interfaces/response.js'

/**
 * @description Validates DB result against schema
 * */
export function validateResData<T>(
  schema: ArraySchema<T>,
): (result: QueryResult<QueryResultRow | QueryResultRow[]>) => boolean
export function validateResData<T>(
  schema: ObjectSchema<T>,
): (result: QueryResult<QueryResultRow | QueryResultRow[]>) => boolean
export function validateResData<T>(schema: ArraySchema<T> | ObjectSchema<T>) {
  return (result: QueryResult<QueryResultRow | QueryResultRow[]> | any[]) => {
    if (isTypeQueryResultRow(result)) {
      if (result.rows?.length === 0) {
        if (result.command === 'SELECT')
          throw new NotFoundError('Requested resource was not found')
        throw new BadRequestError(`${result.command} Operation unsuccessful`)
      }
      if (result.rowCount > 1) {
        const { error } = schema.validate(result.rows)
        if (error) throw new BadRequestError(error.message)
      } else if (result.rowCount === 1) {
        const { error } = schema.validate(result.rows[0])
        if (error) throw new BadRequestError(error.message)
      } else return false
      return true
    } else {
      if (result.length > 1) {
        const { error } = schema.validate(result)
        if (error) throw new BadRequestError(error.message)
      } else if (result.length === 1) {
        const { error } = schema.validate(result[0])
        if (error) throw new BadRequestError(error.message)
      } else return false
      return true
    }
  }
}
