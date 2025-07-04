/* This function is a factory for creating test request executors, allowing initial test parameters to be set up once and reused for multiple specific requests. */

import { StatusCodes } from 'http-status-codes'

export type TestRequestParams = {
  verb: 'get' | 'post' | 'delete' | 'put' | 'patch'
  statusCode: StatusCodes
  validateResData: (data: unknown) => boolean
}

export type TestRequestParamsGeneral = {
  validateReqData?: (data: unknown) => boolean
} & TestRequestParams

export type TestRequest = (
  testRequestParams: TestRequestParams,
) => TestRequestInner

export type TestRequestWithQParamsAndBody = (
  testRequestParams: TestRequestParams & {
    validateReqData: (data: unknown) => boolean
  },
) => TestRequestInnerWQueryNBody

export type TestRequestPublic = (
  testRequestParams: TestRequestParams,
) => TestRequestPublicInner

export type TestRequestWithQParams = (
  testRequestParams: TestRequestParams,
) => TestRequestInnerWQuery

export type TestRequestWithBody = (
  testRequestParams: TestRequestParams & {
    validateReqData: (data: unknown) => boolean
  },
) => TestRequestInnerWBody

type TestRequestInnerWBody = <T>(
  requestParams: RequestParams & { requestBody: T },
) => Promise<any>

type TestRequestPublicInner = <T>(
  requestParams: RequestParams & {
    query: { [k: string]: any } | null
  },
) => Promise<any>

type TestRequestInnerWQuery = <T>(
  requestParams: RequestParams & {
    query: { [k: string]: any } | null
  },
) => Promise<any>

type TestRequestInnerWQueryNBody = <T>(
  requestParams: RequestParams & { requestBody: T } & {
    query: { [k: string]: any } | null
  },
) => Promise<any>

type TestRequestInner = (requestParams: RequestParams) => Promise<any>

export type RequestParams = {
  server: string
  path: string
}
