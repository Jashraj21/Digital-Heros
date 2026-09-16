import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  let supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://ptxptyclotzwhskijwty.supabase.co';
  supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0eHB0eWNsb3R6d2hza2lqd3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NzY2MjcsImV4cCI6MjEwNTE1MjYyN30.XO8QvSWol1uYO4lFjhlqzwkMfZjca1gtWVD951P1FGs';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
