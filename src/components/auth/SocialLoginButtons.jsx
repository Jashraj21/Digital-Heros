'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { AlertCircle } from 'lucide-react';

export function SocialLoginButtons({ onError, onSelectProvider, mode = 'login' }) {
  const { loginWithSocial } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleOAuthLogin = async (provider) => {
    if (onSelectProvider) {
      onSelectProvider(provider);
      return;
    }

    setLoadingProvider(provider);
    if (onError) onError('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        // Direct redirect to real Google / OAuth provider login page
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(`${provider} OAuth error:`, err);
      if (onError) onError(err.message || `Failed to initiate ${provider} login.`);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Primary Google Login Button - Directly redirects to accounts.google.com */}
      <button
        type="button"
        disabled={Boolean(loadingProvider)}
        onClick={() => handleOAuthLogin('google')}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 text-sm font-bold transition-all shadow-lg hover:shadow-white/10 disabled:opacity-50 active:scale-[0.98] border border-slate-200"
      >
        {loadingProvider === 'google' ? (
          <div className="flex items-center gap-2 text-slate-900">
            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            <span>Redirecting to Google...</span>
          </div>
        ) : (
          <>
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.8 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.3 0 10.4 0 12.7s.6 4.4 1.6 6.3l3.7-4.3z"
              />
              <path
                fill="#34A853"
                d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.4-6.7-5.3L1.6 16.4C3.5 20.2 7.4 23.5 12 23.5z"
              />
            </svg>
            <span>Continue with Google</span>
          </>
        )}
      </button>

      {/* Grid for Apple, Facebook, GitHub */}
      <div className="grid grid-cols-3 gap-2">
        {/* Apple */}
        <button
          type="button"
          disabled={Boolean(loadingProvider)}
          onClick={() => handleOAuthLogin('apple')}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-white text-xs font-semibold transition-all disabled:opacity-50 active:scale-[0.98]"
        >
          {loadingProvider === 'apple' ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.9.04-2 .6-2.63 1.34-.56.64-.99 1.7-0.87 2.73 1.01.08 1.98-.48 2.58-1.2" />
              </svg>
              <span>Apple</span>
            </>
          )}
        </button>

        {/* Facebook */}
        <button
          type="button"
          disabled={Boolean(loadingProvider)}
          onClick={() => handleOAuthLogin('facebook')}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 text-white text-xs font-semibold transition-all disabled:opacity-50 active:scale-[0.98]"
        >
          {loadingProvider === 'facebook' ? (
            <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </>
          )}
        </button>

        {/* GitHub */}
        <button
          type="button"
          disabled={Boolean(loadingProvider)}
          onClick={() => handleOAuthLogin('github')}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-white text-xs font-semibold transition-all disabled:opacity-50 active:scale-[0.98]"
        >
          {loadingProvider === 'github' ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
            </>
          )}
        </button>
      </div>

      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-slate-800 w-full" />
        <span className="bg-slate-900 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 absolute">
          or continue with email
        </span>
      </div>
    </div>
  );
}
