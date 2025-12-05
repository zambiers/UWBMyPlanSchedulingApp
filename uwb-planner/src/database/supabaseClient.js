//everything from this file was grabbed from supabase

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sgjsdjxlihfgoydcfpkf.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
