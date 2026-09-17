'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const AuthContext = createContext({
  user: null,
  subscription: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  loginAsDemo: async () => {},
  loginWithSocial: async () => {},
  sendPhoneOtp: async () => {},
  verifyPhoneOtp: async () => {},
  signup: async () => {},
  logout: () => {},
  refreshSession: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from Supabase Auth or localStorage or default to player demo
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const initAuth = async () => {
      try {
        const isSignedOut = localStorage.getItem('dh_signed_out') === 'true';
        const storedUser = localStorage.getItem('dh_user');
        const storedSub = localStorage.getItem('dh_sub');
        const isCurrentlyOnAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

        // 1. If storedUser exists in localStorage, restore that active session directly
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (isMounted) {
              setUser(parsedUser);
              if (storedSub) setSubscription(JSON.parse(storedSub));
            }
            return;
          } catch (e) {
            console.error('Failed to parse stored user:', e);
          }
        }

        // 2. Check Supabase active session (for initial Google OAuth callback) if not signed out
        if (!isSignedOut) {
          const { data: sessionData } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
          const sbUser = sessionData?.session?.user;

          if (sbUser) {
            const formattedUser = {
              id: sbUser.id,
              email: sbUser.email,
              fullName: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Golf Player',
              role: sbUser.user_metadata?.role || (sbUser.email?.includes('admin') ? 'admin' : 'user'),
              avatarUrl: sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(sbUser.email || 'golf')}`,
              authProvider: sbUser.app_metadata?.provider || 'oauth',
            };
            const formattedSub = {
              id: `sub-${sbUser.id.substring(0, 8)}`,
              userId: sbUser.id,
              plan: 'monthly',
              status: 'active',
              priceAmount: 1999.0,
              currency: 'INR',
              currentPeriodStart: '2026-03-01T00:00:00.000Z',
              currentPeriodEnd: '2026-04-01T00:00:00.000Z',
            };
            if (isMounted) {
              setUser(formattedUser);
              setSubscription(formattedSub);
              localStorage.setItem('dh_user', JSON.stringify(formattedUser));
              localStorage.setItem('dh_sub', JSON.stringify(formattedSub));
            }
            return;
          }
        }

        // 3. Fallback: if not signed out and not on admin portal, default player demo session
        if (!isSignedOut && !isCurrentlyOnAdmin) {
          const defaultUser = {
            id: 'user-player',
            email: 'jashraaj@gmail.com',
            fullName: 'Jashraaj Sharma',
            role: 'user',
            authProvider: 'google',
            avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=jashraaj%40gmail.com',
          };
          const defaultSub = {
            id: 'sub-player',
            userId: 'user-player',
            plan: 'monthly',
            status: 'active',
            priceAmount: 1999.0,
            currency: 'INR',
            currentPeriodStart: '2026-03-01T00:00:00.000Z',
            currentPeriodEnd: '2026-04-01T00:00:00.000Z',
          };
          if (isMounted) {
            setUser(defaultUser);
            setSubscription(defaultSub);
            localStorage.setItem('dh_user', JSON.stringify(defaultUser));
            localStorage.setItem('dh_sub', JSON.stringify(defaultSub));
          }
        } else {
          if (isMounted) {
            setUser(null);
            setSubscription(null);
          }
        }
      } catch (e) {
        console.error('Error loading session:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    // Listen to Supabase auth state changes (e.g. after Google OAuth callback)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const storedUser = localStorage.getItem('dh_user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed && (parsed.role === 'admin' || parsed.authProvider === 'email')) {
              return;
            }
          } catch (e) {}
        }

        const u = session.user;
        const formattedUser = {
          id: u.id,
          email: u.email,
          fullName: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Golf Player',
          role: u.user_metadata?.role || (u.email?.includes('admin') ? 'admin' : 'user'),
          avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.email || 'golf')}`,
          authProvider: u.app_metadata?.provider || 'oauth',
        };
        const formattedSub = {
          id: `sub-${u.id.substring(0, 8)}`,
          userId: u.id,
          plan: 'monthly',
          status: 'active',
          priceAmount: 1999.0,
          currency: 'INR',
          currentPeriodStart: '2026-03-01T00:00:00.000Z',
          currentPeriodEnd: '2026-04-01T00:00:00.000Z',
        };
        setUser(formattedUser);
        setSubscription(formattedSub);
        localStorage.removeItem('dh_signed_out');
        localStorage.setItem('dh_user', JSON.stringify(formattedUser));
        localStorage.setItem('dh_sub', JSON.stringify(formattedSub));
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password, role) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut().catch(() => {});

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      setUser(data.user);
      setSubscription(data.subscription);
      localStorage.removeItem('dh_signed_out');
      localStorage.setItem('dh_user', JSON.stringify(data.user));
      if (data.subscription) {
        localStorage.setItem('dh_sub', JSON.stringify(data.subscription));
      }
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = (role = 'user') => {
    let demoUser, demoSub;
    if (role === 'admin') {
      demoUser = {
        id: 'user-admin',
        email: 'admin@admin.in',
        fullName: 'David Sterling (Admin)',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      demoSub = {
        id: 'sub-admin',
        userId: 'user-admin',
        plan: 'yearly',
        status: 'active',
        priceAmount: 19999.0,
        currency: 'INR',
        currentPeriodStart: '2026-01-01T00:00:00.000Z',
        currentPeriodEnd: '2027-01-01T00:00:00.000Z',
      };
    } else {
      demoUser = {
        id: 'user-player',
        email: 'jashraaj@gmail.com',
        fullName: 'Jashraaj Sharma',
        role: 'user',
        authProvider: 'google',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=jashraaj%40gmail.com',
      };
      demoSub = {
        id: 'sub-player',
        userId: 'user-player',
        plan: 'monthly',
        status: 'active',
        priceAmount: 1999.0,
        currency: 'INR',
        currentPeriodStart: '2026-03-01T00:00:00.000Z',
        currentPeriodEnd: '2026-04-01T00:00:00.000Z',
      };
    }

    setUser(demoUser);
    setSubscription(demoSub);
    localStorage.removeItem('dh_signed_out');
    localStorage.setItem('dh_user', JSON.stringify(demoUser));
    localStorage.setItem('dh_sub', JSON.stringify(demoSub));
    return demoUser;
  };

  const loginWithSocial = async (provider = 'google', email = null, fullName = null) => {
    setIsLoading(true);
    try {
      const provLower = (provider || 'google').toLowerCase();
      const targetEmail = email || (provLower === 'google' ? 'jashraaj@gmail.com' : `${provLower}.user@digitalheroes.co.in`);
      const targetName = fullName || (provLower === 'google' ? 'Jashraaj Sharma' : `${provLower.charAt(0).toUpperCase() + provLower.slice(1)} Hero`);

      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: provLower,
          email: targetEmail.trim(),
          fullName: targetName.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to sign in with ${provider}`);

      setUser(data.user);
      setSubscription(data.subscription);
      localStorage.removeItem('dh_signed_out');
      localStorage.setItem('dh_user', JSON.stringify(data.user));
      if (data.subscription) {
        localStorage.setItem('dh_sub', JSON.stringify(data.subscription));
      }
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSupabaseOAuth = async (provider = 'google') => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const provLower = (provider || 'google').toLowerCase();
      const mappedProvider = provLower === 'facebook' ? 'facebook' : provLower === 'apple' ? 'apple' : provLower === 'github' ? 'github' : 'google';

      if (typeof window !== 'undefined') {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: mappedProvider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          console.warn('Supabase OAuth notice:', error.message);
          return await loginWithSocial(provider);
        }

        if (data?.url) {
          window.location.href = data.url;
          return null;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendPhoneOtp = async (phone) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_otp', phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhoneOtp = async (phone, code, fullName) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phone: phone.trim(), code: code.trim(), fullName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verification failed');

      setUser(data.user);
      setSubscription(data.subscription);
      localStorage.removeItem('dh_signed_out');
      localStorage.setItem('dh_user', JSON.stringify(data.user));
      if (data.subscription) {
        localStorage.setItem('dh_sub', JSON.stringify(data.subscription));
      }
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (signupData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');

      setUser(data.user);
      setSubscription(data.subscription);
      localStorage.removeItem('dh_signed_out');
      localStorage.setItem('dh_user', JSON.stringify(data.user));
      if (data.subscription) {
        localStorage.setItem('dh_sub', JSON.stringify(data.subscription));
      }
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (redirectPath) => {
    const isCurrentlyOnAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    try {
      const supabase = createClient();
      await supabase.auth.signOut().catch(() => {});
    } catch (e) {
      console.warn('Supabase sign out error:', e);
    }
    setUser(null);
    setSubscription(null);
    localStorage.removeItem('dh_user');
    localStorage.removeItem('dh_sub');
    localStorage.setItem('dh_signed_out', 'true');
    if (typeof window !== 'undefined') {
      if (redirectPath) {
        window.location.href = redirectPath;
      } else if (isCurrentlyOnAdmin) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/';
      }
    }
  };

  const refreshSession = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/users/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setSubscription(data.subscription);
        localStorage.setItem('dh_user', JSON.stringify(data.user));
        if (data.subscription) localStorage.setItem('dh_sub', JSON.stringify(data.subscription));
      }
    } catch (e) {
      console.error('Failed to refresh session:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        isLoading,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        login,
        loginAsDemo,
        loginWithSocial,
        loginWithSupabaseOAuth,
        sendPhoneOtp,
        verifyPhoneOtp,
        signup,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
