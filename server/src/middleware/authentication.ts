import { Response, NextFunction } from 'express'
import UnauthorizedError from '../errors/unauthorized.js'
import { RequestWithPayload } from '../types/request.js'
import { supabase } from '#supabase-config'
import InternalServerError from '#src/errors/internal-server.js'

export default async (
  request: RequestWithPayload,
  response: Response,
  next: NextFunction,
) => {
  try {
    // check header for token
    const authHeader = request.headers.authorization
    if (authHeader && authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      // Supabase JWT verification
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token)
      if (error || !user.id) {
        console.error('Supabase token verification error:', error?.message)
        throw new UnauthorizedError(
          'Invalid token please retry the signin process',
        )
      }
      request.userId = user.id // 'sub' typically contains the user ID in JWT claims
    }
    next()
  } catch (error) {
    if (error instanceof InternalServerError)
      return response.status(error.statusCode).send(error.message)
    throw error
  }
}
