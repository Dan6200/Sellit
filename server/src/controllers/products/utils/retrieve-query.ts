//cspell:ignore jsonb
import { QueryResult, QueryResultRow } from 'pg'
import { QueryParams } from '../../../types/process-routes.js'
import getAllQueryProtected from './retrieve-query/retrieve-all-protected.js'
import { getAllQuery } from './retrieve-query/retrieve-all.js'
import getQueryProtected from './retrieve-query/retrieve-protected.js'
import getQuery from './retrieve-query/retrieve.js'

export const getAllQueryForwarder = <T>(
  routeIsPublic: string | undefined,
): ((qp: QueryParams<T>) => Promise<QueryResult<QueryResultRow>>) => {
  if (routeIsPublic === 'true') {
    return getAllQuery
  }
  return getAllQueryProtected
}

export const getQueryForwarder = <T>(
  routeIsPublic: string | undefined,
): ((qp: QueryParams<T>) => Promise<QueryResult<QueryResultRow>>) => {
  if (routeIsPublic === 'true') {
    return getQuery
  }
  return getQueryProtected
}
