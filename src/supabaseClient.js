// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aipazesddbawrewyvxgd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpcGF6ZXNkZGJhd3Jld3l2eGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5ODcwNDksImV4cCI6MjA5ODU2MzA0OX0.2-7lxQ3D-NkMytNaCKxs31aImeG5iTLQD5OPgRHPkOo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)