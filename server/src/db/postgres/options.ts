import { connectionString } from './config.js'

export const knexOptions = {
  client: 'pg',
  connection: {
    connectionString,
    searchPath: process.env.VERCEL_ENV === 'preview' ? ['staging'] : undefined, // Use preview as staging to workaround vercel's BS!
  },
}

export const pgOptions = {
  connectionString,
  ssl: process.env.NODE_ENV.match(/(production|development)/)
    ? {
        rejectUnauthorized: false,
      }
    : false,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
  searchPath: process.env.VERCEL_ENV === 'preview' ? ['staging'] : undefined,
}
