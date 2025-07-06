/*
import { QueryResultRow } from 'pg'
import db from '../../db/index.js'
import BadRequestError from '../../errors/bad-request.js'
import { validatePassword } from '../../security/password.js'
import { isValidDBResponse } from '../../types/response.js'
import { SelectRecord } from './generate-sql-commands/index.js'


 * @param Id - user id
 * @param candidatePassword - password to be validated
 * @returns boolean

export default async (
  Id: string,
  candidatePassword: string
): Promise<boolean> => {
  const response: unknown = await db.query({
    text: SelectRecord('user_accounts', ['password'], 'user_id=$1'),
    values: [Id],
  })
  if (!isValidDBResponse(response))
    throw new BadRequestError('Cannot validate user password')
  const data = <QueryResultRow>response.rows[0]
  const password = <Buffer>data.password
  const isMatch: boolean = await validatePassword(
    candidatePassword,
    password.toString()
  )
  return isMatch
}
*/
