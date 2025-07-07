import { ArraySchema, ObjectSchema } from 'joi'
import { QueryResult, QueryResultRow } from 'pg'
import BadRequestError from '../../errors/bad-request.js'
import NotFoundError from '../../errors/not-found.js'
import { isTypeQueryResultRow } from '../../types/response.js'

/**
 * @description Validates DB result against schema
 * */
export function validateResData<T>(
  schema: ArraySchema<T>,
): (result: QueryResult<QueryResultRow> | any[]) => boolean
export function validateResData<T>(
  schema: ObjectSchema<T>,
): (result: QueryResult<QueryResultRow> | any[]) => boolean
export function validateResData<T>(schema: ArraySchema<T> | ObjectSchema<T>) {
  return (result: QueryResult<QueryResultRow> | any[]) => {
    process.env.DEBUG &&
      console.log(
        'DEBUG: DB response (validate step) -> ' + JSON.stringify(result),
      )
    if (isTypeQueryResultRow(result)) {
      if (result.rows?.length === 0) {
        if (result.command === 'SELECT')
          throw new NotFoundError('Requested resource was not found')
        throw new BadRequestError(`${result.command} Operation unsuccessful`)
      }

      // Handle cases where more than one row is returned
      if (result.rowCount > 1) {
        if (schema.type === 'object') {
          // If an ObjectSchema is provided, but multiple rows are returned, it's an error
          throw new BadRequestError(
            `${result.command} operated erroneously: expected single row, got multiple`,
          )
        } else if (schema.type === 'array') {
          // If an ArraySchema is provided, validate the entire array of rows
          const { error } = schema.validate(result.rows)
          if (error) throw new BadRequestError(error.message)
        }
      } else if (result.rowCount === 1) {
        // If exactly one row is returned, validate it against the schema
        const { error } = schema.validate(result.rows[0])
        if (error) throw new BadRequestError(error.message)
      } else {
        // This case should ideally be caught by result.rows?.length === 0, but as a fallback
        return false
      }
      return true
    } else {
      // This block handles `any[]` results, not `QueryResult`
      if (result?.length === 0) {
        // Assuming empty array means resource not found for generic array results
        throw new NotFoundError(`Requested resource was not found`)
      }
      if (result?.length > 1) {
        if (schema.type === 'object') {
          throw new BadRequestError(
            `Operation operated erroneously: expected single item, got multiple`,
          )
        } else if (schema.type === 'array') {
          const { error } = schema.validate(result)
          if (error) throw new BadRequestError(error.message)
        }
      } else if (result?.length === 1) {
        const { error } = schema.validate(result[0])
        if (error) throw new BadRequestError(error.message)
      } else {
        return false
      }
      return true
    }
  }
}
