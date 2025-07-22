import { connectionString } from './config.js'

export const knexOptions = {
  client: 'pg',
  connection: {
    connectionString,
  },
}

export const pgOptions = {
  connectionString,
  ssl: process.env.NODE_ENV.match(/(production)/)
    ? {
        rejectUnauthorized: false,
      }
    : false,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
}
