import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supabase.com/project/xluajvibbdbqhxygpdlk';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdWFqdmliYmRicWh4eWdwZGxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MTA2MTYsImV4cCI6MjA5ODQ4NjYxNn0.4p9Ccs0-X24rXz-zoSROQqaPaNjPvsB2BlnCCcDQwsg';

export const supabase = createClient(supabaseUrl, supabaseKey);