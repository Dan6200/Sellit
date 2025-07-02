import { Response, NextFunction } from 'express'
import UnauthorizedError from '../errors/unauthorized.js'
import { RequestWithPayload } from '../types-and-interfaces/request.js'
import { supabase } from '#supabase-config'

export default async (
  request: RequestWithPayload,
  _response: Response,
  next: NextFunction,
) => {
  // if route is public, skip authentication
  if (request.query.public === 'true') {
    return next()
  }

  // check header for token
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader?.startsWith('Bearer '))
    throw new UnauthorizedError('Unauthorized Operation')
  const token = authHeader.split(' ')[1]
  try {
    // Supabase JWT verification
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)
    if (error || !user.id) {
      console.error('Supabase token verification error:', error?.message)
      throw new UnauthorizedError('Unauthorized Operation')
    }
    request.uid = user.id // 'sub' typically contains the user ID in JWT claims
    next()
  } catch (err) {
    console.error('Error during Supabase authentication:', err)
    throw new UnauthorizedError('Unauthorized Operation')
  }
}
