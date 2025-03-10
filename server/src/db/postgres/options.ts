import { connectionString } from './config.js'

export const knexOptions = {
  client: 'pg',
  connection: {
    connectionString,
    ssl: process.env.NODE_ENV.match(/(production|development)/)
      ? {
          rejectUnauthorized: false,
        }
      : false,
  },
}

export const connectionOptions = {
  connectionString,
  ssl: process.env.NODE_ENV.match(/(production|development)/)
    ? {
        rejectUnauthorized: false,
      }
    : false,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
}
