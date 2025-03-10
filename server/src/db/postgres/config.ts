import dotenv from 'dotenv'
if (process.env.NODE_ENV === 'production')
  dotenv.config({ path: `/etc/secrets/.env.${process.env.NODE_ENV}` })
else dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

export const connectionString = process.env.PG_URL
