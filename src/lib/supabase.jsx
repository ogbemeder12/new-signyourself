
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vqqusvvxyckwvbmkhaec.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxcXVzdnZ4eWNrd3ZibWtoYWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDc0MjYsImV4cCI6MjA1OTI4MzQyNn0.ZdZ_zXN6ASR0juOfVaH4hinfuqwXxsjs4pweiqPVhT0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, 
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  }
});
