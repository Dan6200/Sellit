import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

let path = '.env.' + process.env.VERCEL_ENV

if (process.env.NODE_ENV === 'testing') {
  if (process.env.CI) path += '.ci'
  else path += '.local'
}

dotenv.config({ path })

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)
