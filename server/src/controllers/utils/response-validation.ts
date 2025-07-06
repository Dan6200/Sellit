import { ArraySchema, ObjectSchema } from 'joi'
import { QueryResult, QueryResultRow } from 'pg'
import BadRequestError from '../../errors/bad-request.js'
import NotFoundError from '../../errors/not-found.js'
import { isTypeQueryResultRow } from '../../types/response.js'

// Define a type for Supabase response for clarity
interface SupabaseResponse<T> {
  data: T[] | T | null
  error: {
    message: string
    details?: string
    hint?: string
    code?: string
  } | null
  count?: number | null
  status?: number
  statusText?: string
}

// Type guard for Supabase response
function isSupabaseResponse<T>(result: any): result is SupabaseResponse<T> {
  return (
    typeof result === 'object' &&
    result !== null &&
    'data' in result &&
    'error' in result
  )
}

/**
 * @description Validates DB result against schema
 * */
export function validateResData<T>(
  schema: ArraySchema<T>,
): (
  result: QueryResult<QueryResultRow> | SupabaseResponse<T> | any[],
) => boolean
export function validateResData<T>(
  schema: ObjectSchema<T>,
): (
  result: QueryResult<QueryResultRow> | SupabaseResponse<T> | any[],
) => boolean
export function validateResData<T>(schema: ArraySchema<T> | ObjectSchema<T>) {
  return (
    result: QueryResult<QueryResultRow> | SupabaseResponse<T> | any[],
  ) => {
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
    } else if (isSupabaseResponse<T>(result)) {
      if (result.error) {
        throw new BadRequestError(
          `Supabase operation failed: ${result.error.message}`,
        )
      }

      const dataToValidate = Array.isArray(result.data)
        ? result.data
        : result.data
          ? [result.data]
          : []

      if (dataToValidate.length === 0) {
        throw new NotFoundError(
          'Requested resource was not found from Supabase',
        )
      }

      if (dataToValidate.length > 1) {
        if (schema.type === 'object') {
          throw new BadRequestError(
            `Supabase operation operated erroneously: expected single item, got multiple`,
          )
        } else if (schema.type === 'array') {
          const { error } = schema.validate(dataToValidate)
          if (error) throw new BadRequestError(error.message)
        }
      } else if (dataToValidate.length === 1) {
        const { error } = schema.validate(dataToValidate[0])
        if (error) throw new BadRequestError(error.message)
      } else {
        return false
      }
      return true
    } else {
      // This block handles `any[]` results, not `QueryResult` or SupabaseResponse
      if (result.length === 0) {
        // Assuming empty array means resource not found for generic array results
        throw new NotFoundError(`Requested resource was not found`)
      }
      if (result.length > 1) {
        if (schema.type === 'object') {
          throw new BadRequestError(
            `Operation operated erroneously: expected single item, got multiple`,
          )
        } else if (schema.type === 'array') {
          const { error } = schema.validate(result)
          if (error) throw new BadRequestError(error.message)
        }
      } else if (result.length === 1) {
        const { error } = schema.validate(result[0])
        if (error) throw new BadRequestError(error.message)
      } else {
        return false
      }
      return true
    }
  }
}
