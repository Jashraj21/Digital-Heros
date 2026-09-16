'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/constants/routes';
import { Trophy, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState('Completing Google authentication...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const processOAuth = async () => {
      try {
        const supabase = createClient();

        // 1. Check if URL has ?code parameter for PKCE
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
          setStatus('Exchanging Google credentials...');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.warn('PKCE exchange note:', exchangeError.message);
          }
        }

        // 2. Get active session from Supabase
        const { data: sessionData } = await supabase.auth.getSession();
        let user = sessionData?.session?.user;

        if (!user) {
          // Check if hash has access token (implicit grant)
          const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken) {
            const { data: setSessionData, error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
            user = setSessionData?.user || setSessionData?.session?.user;
          }
        }

        if (user) {
          setStatus('Setting up your golfer profile & 5 rolling scores...');
          const userEmail = user.email || 'player@digitalheroes.co.in';
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            userEmail.split('@')[0] ||
            'Golf Hero';
          const avatarUrl =
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userEmail)}`;

          // Sync with mock-store API
          try {
            const res = await fetch('/api/auth/social', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                provider: user.app_metadata?.provider || 'google',
                email: userEmail,
                fullName,
                avatarUrl,
              }),
            });
            const data = await res.json();
            if (data.user) {
              localStorage.removeItem('dh_signed_out');
              localStorage.setItem('dh_user', JSON.stringify(data.user));
              if (data.subscription) {
                localStorage.setItem('dh_sub', JSON.stringify(data.subscription));
              }
            }
          } catch (e) {
            console.warn('Social sync note:', e);
          }

          setStatus('Redirecting to Dashboard...');
          window.location.href = ROUTES.DASHBOARD;
          return;
        }

        // Fallback: If session couldn't be loaded, recover default Google session
        setStatus('Initializing your profile...');
        const res = await fetch('/api/auth/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: 'google',
          }),
        });
        const data = await res.json();
        if (data.user) {
          localStorage.removeItem('dh_signed_out');
          localStorage.setItem('dh_user', JSON.stringify(data.user));
          if (data.subscription) {
            localStorage.setItem('dh_sub', JSON.stringify(data.subscription));
          }
          window.location.href = ROUTES.DASHBOARD;
          return;
        }

        window.location.href = ROUTES.DASHBOARD;
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication error');
        setTimeout(() => {
          window.location.href = ROUTES.DASHBOARD;
        }, 1200);
      }
    };

    processOAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="w-full max-w-sm bg-slate-950/80 border border-slate-800 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-black text-white">Digital Heroes</h2>
          <p className="text-xs text-slate-400 mt-1">{status}</p>
        </div>

        {error ? (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-emerald-400 font-semibold">Please wait...</span>
          </div>
        )}
      </div>
    </div>
  );
}
