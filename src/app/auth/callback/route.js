import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data?.user) {
        return NextResponse.redirect(`${requestUrl.origin}${next}`);
      }
    } catch (e) {
      console.error('Supabase OAuth exchange error:', e);
    }
  }

  // If code exchange failed or no code, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=oauth_error`);
}
