import dotenv from 'dotenv'

let path = `.env.${process.env.VERCEL_ENV ? process.env.VERCEL_ENV : process.env.NODE_ENV}`

if (process.env.NODE_ENV === 'testing') {
  if (process.env.CI) path += '.ci'
  else path += '.local'
}

dotenv.config({ path })

export const connectionString = process.env.SUPABASE_DB_URL
