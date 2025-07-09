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

export type QueryDB = (
  queryParams: QueryParams,
) => Promise<Knex.QueryBuilder | QueryResult<QueryResultRow | QueryResultRow[]>>

export type ProcessRouteWithoutBody = <T>({
  Query,
  status,
  validateResult,
}: {
  Query(
    queryParams: QueryParams,
  ): Promise<
    void | Knex.QueryBuilder | QueryResult<QueryResultRow | QueryResultRow[]>
  >
  status: Status
  validateResult: (
    result: QueryResult<QueryResultRow | QueryResultRow[]>,
  ) => boolean
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
  Query: QueryDB
  status: Status
}) => (request: RequestWithPayload, response: Response) => Promise<void>

export type ProcessRoute = <T>({
  Query,
  status,
  validateBody,
  validateResult,
}: {
  Query(
    queryParams: QueryParams,
  ): Promise<
    | void
    | string
    | number
    | Knex.QueryBuilder
    | QueryResult<QueryResultRow | QueryResultRow[]>
  >
  status: Status
  validateBody: (data: unknown) => boolean
  validateResult: (
    result: QueryResult<QueryResultRow | QueryResultRow[]>,
  ) => boolean
}) => (
  request: RequestWithPayload,
  response: Response,
) => Promise<Response<T, Record<string, T>>>
