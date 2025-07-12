import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)
