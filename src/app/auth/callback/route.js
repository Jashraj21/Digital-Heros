import { createServerSupabaseClient } from '@/lib/supabase/server';
import { store } from '@/lib/data/mock-store';
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
        const u = data.user;
        const provider = u.app_metadata?.provider || 'google';
        const userEmail = u.email;
        const fullName = u.user_metadata?.full_name || u.user_metadata?.name || userEmail?.split('@')[0];
        const avatarUrl = u.user_metadata?.avatar_url || u.user_metadata?.picture;

        // Auto-provision 5 rolling scores & active INR subscription for the real Google golfer
        store.findOrCreateSocialUser({
          provider,
          email: userEmail,
          fullName,
          avatarUrl,
        });

        return NextResponse.redirect(`${requestUrl.origin}${next}`);
      }
    } catch (e) {
      console.error('Supabase OAuth exchange error:', e);
    }
  }

  // If code exchange failed or no code, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=oauth_error`);
}
