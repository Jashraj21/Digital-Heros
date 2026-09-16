'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/constants/routes';
import { X, ArrowRight, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

export function SocialLoginButtons({ onError, onSelectProvider, mode = 'login' }) {
  const { loginWithSocial } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [activeModalProvider, setActiveModalProvider] = useState(null); // 'google' | 'facebook' | 'apple' | 'github' | null
  const [realEmail, setRealEmail] = useState('');
  const [realName, setRealName] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const handleProviderButtonClick = (provider) => {
    if (onSelectProvider) {
      onSelectProvider(provider);
      return;
    }
    setActiveModalProvider(provider);
    if (provider === 'google') {
      setRealEmail('jashraaj@gmail.com');
      setRealName('Jashraaj Sharma');
    } else {
      setRealEmail('');
      setRealName('');
    }
  };

  const handleCustomSocialLogin = async (e) => {
    e.preventDefault();
    if (!realEmail || !realEmail.includes('@')) {
      if (onError) onError('Please enter your real email address.');
      return;
    }

    setModalLoading(true);
    if (onError) onError('');

    try {
      const user = await loginWithSocial(activeModalProvider, realEmail.trim(), realName.trim() || undefined);
      if (user) {
        window.location.href = user.role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD;
      }
    } catch (err) {
      if (onError) onError(err.message || `Failed to sign in with ${activeModalProvider}`);
      setModalLoading(false);
    }
  };

  const handleDirectOAuthRedirect = async () => {
    setModalLoading(true);
    if (onError) onError('');
    try {
      const user = await loginWithSocial(activeModalProvider);
      if (user) {
        window.location.href = user.role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD;
      }
    } catch (err) {
      if (onError) onError(err.message || `Failed to initiate OAuth redirect for ${activeModalProvider}`);
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5">
        {/* Google */}
        <button
          type="button"
          disabled={Boolean(loadingProvider)}
          onClick={() => handleProviderButtonClick('google')}
          className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-white text-xs font-semibold transition-all disabled:opacity-50 active:scale-[0.98] group"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
        </button>

        {/* Facebook */}
        <button
          type="button"
          disabled={Boolean(loadingProvider)}
          onClick={() => handleProviderButtonClick('facebook')}
          className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 text-white text-xs font-semibold transition-all disabled:opacity-50 active:scale-[0.98]"
        >
          <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Facebook</span>
        </button>

        {/* Apple */}
        <button
          type="button"
          disabled={Boolean(loadingProvider)}
          onClick={() => handleProviderButtonClick('apple')}
          className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-white text-xs font-semibold transition-all disabled:opacity-50 active:scale-[0.98]"
        >
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.9.04-2 .6-2.63 1.34-.56.64-.99 1.7-0.87 2.73 1.01.08 1.98-.48 2.58-1.2" />
          </svg>
          <span>Apple ID</span>
        </button>

        {/* GitHub */}
        <button
          type="button"
          disabled={Boolean(loadingProvider)}
          onClick={() => handleProviderButtonClick('github')}
          className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-white text-xs font-semibold transition-all disabled:opacity-50 active:scale-[0.98]"
        >
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span>GitHub</span>
        </button>
      </div>

      {/* Interactive Real Account Connect Modal */}
      {activeModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white capitalize">
                    Connect {activeModalProvider} Account
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Sign in with your real personal identity & golf profile
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalProvider(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCustomSocialLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Your Real Full Name
                </label>
                <input
                  type="text"
                  required
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  placeholder="e.g. Jashraaj Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Your Real Google / Social Email
                </label>
                <input
                  type="email"
                  required
                  value={realEmail}
                  onChange={(e) => setRealEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-emerald-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  Your profile will be initialized with your real name & 5 rolling golf handicap scores.
                </span>
              </div>

              <button
                type="submit"
                disabled={modalLoading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {modalLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In as {realName || 'Your Real Profile'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Optional Direct Supabase OAuth Trigger */}
            <div className="pt-2 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={handleDirectOAuthRedirect}
                disabled={modalLoading}
                className="text-[11px] text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Or launch Supabase external {activeModalProvider} OAuth redirect</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-slate-800 w-full" />
        <span className="bg-slate-900 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 absolute">
          or continue with email
        </span>
      </div>
    </div>
  );
}
