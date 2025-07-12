import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { QueryResult, QueryResultRow } from 'pg'
import { ParsedQs } from 'qs'
import { RequestWithPayload } from './request.js'
import { Knex } from 'knex'
const { CREATED, OK, NO_CONTENT, NOT_FOUND } = StatusCodes

export type Status =
  | typeof CREATED
  | typeof OK
  | typeof NO_CONTENT
  | typeof NOT_FOUND

export type QueryParams = {
  userId?: string
  body?: { [key: string]: any }
  params?: { [key: string]: string }
  query?: ParsedQs
}

export type QueryDB = <T>(queryParams: QueryParams) => Promise<T | T[]>

export type ProcessRouteWithoutBody = <T>({
  Query,
  status,
  validateResult,
}: {
  Query(queryParams: QueryParams): Promise<T | T[]>
  status: Status
  validateResult: (result: QueryResult<T | T[]>) => boolean
}) => (
  request: RequestWithPayload,
  response: Response,
) => Promise<Response<T, Record<string, T>>>

export type ProcessRouteWithNoDBResult = <T>({
  Query,
  status,
  validateBody,
}: {
  Query: (queryData: {
    userId?: string
    body?: Record<string, T>
    params?: Record<string, string>
    query?: ParsedQs
  }) => Promise<Record<string, T>>
  status: Status
  validateBody?: (data: unknown) => boolean
}) => (
  request: RequestWithPayload,
  response: Response,
) => Promise<Response<T, Record<string, T>>>

export type ProcessRouteWithoutBodyAndDBResult = ({
  Query,
  status,
}: {
  Query: (queryParams: QueryParams) => Promise<void>

  status: Status
}) => (request: RequestWithPayload, response: Response) => Promise<void>

export type ProcessRoute = <T>({
  Query,
  status,
  validateBody,
  validateResult,
}: {
  Query(queryParams: QueryParams): Promise<T | T[]>
  status: Status
  validateBody: (data: unknown) => boolean
  validateResult: (result: QueryResult<T | T[]>) => boolean
}) => (
  request: RequestWithPayload,
  response: Response,
) => Promise<Response<T, Record<string, T>>>
