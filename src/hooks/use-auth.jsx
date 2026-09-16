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

        // 1. Check Supabase active session first
        const { data: sessionData } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
        const sbUser = sessionData?.session?.user;

        if (sbUser && !isSignedOut) {
          const formattedUser = {
            id: sbUser.id,
            email: sbUser.email,
            fullName: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Golf Player',
            role: sbUser.user_metadata?.role || (sbUser.email?.includes('admin') ? 'admin' : 'user'),
            avatarUrl: sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          };
          const formattedSub = {
            id: `sub-${sbUser.id.substring(0, 8)}`,
            userId: sbUser.id,
            plan: 'monthly',
            status: 'active',
            priceAmount: 1999.0,
            currency: 'INR',
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

        if (storedUser) {
          if (isMounted) {
            setUser(JSON.parse(storedUser));
            if (storedSub) setSubscription(JSON.parse(storedSub));
          }
        } else if (!isSignedOut) {
          // Default demo session for initial visit
          const defaultUser = {
            id: 'user-player',
            email: 'player@digitalheroes.co.in',
            fullName: 'Jashraaj Sharma',
            role: 'user',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          };
          const defaultSub = {
            id: 'sub-player',
            userId: 'user-player',
            plan: 'monthly',
            status: 'active',
            priceAmount: 1999.0,
            currency: 'INR',
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

    // Listen to Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const u = session.user;
        const formattedUser = {
          id: u.id,
          email: u.email,
          fullName: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'Golf Player',
          role: u.user_metadata?.role || (u.email?.includes('admin') ? 'admin' : 'user'),
          avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        };
        const formattedSub = {
          id: `sub-${u.id.substring(0, 8)}`,
          userId: u.id,
          plan: 'monthly',
          status: 'active',
          priceAmount: 1999.0,
          currency: 'INR',
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

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to login');

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
        email: 'admin@digitalheroes.co.in',
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
      };
    } else {
      demoUser = {
        id: 'user-player',
        email: 'player@digitalheroes.co.in',
        fullName: 'Jashraaj Sharma',
        role: 'user',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      };
      demoSub = {
        id: 'sub-player',
        userId: 'user-player',
        plan: 'monthly',
        status: 'active',
        priceAmount: 1999.0,
        currency: 'INR',
      };
    }

    setUser(demoUser);
    setSubscription(demoSub);
    localStorage.removeItem('dh_signed_out');
    localStorage.setItem('dh_user', JSON.stringify(demoUser));
    localStorage.setItem('dh_sub', JSON.stringify(demoSub));
    return demoUser;
  };

  const loginWithSocial = async (provider = 'google') => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const provLower = provider.toLowerCase();

      // Check if Supabase client can initiate real OAuth redirect
      if (typeof window !== 'undefined') {
        try {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provLower === 'facebook' ? 'facebook' : provLower === 'apple' ? 'apple' : provLower === 'github' ? 'github' : 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (!error && data?.url) {
            window.location.href = data.url;
            return null;
          }
        } catch (oauthErr) {
          console.warn('Supabase OAuth redirect error (falling back to instant social session):', oauthErr?.message);
        }
      }

      // Fallback: Instant social profile login for demo / local dev
      const socialProfiles = {
        google: {
          email: 'alex.walker.golf@gmail.com',
          fullName: 'Alex Walker (Google)',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        },
        facebook: {
          email: 'sarah.jenkins.links@facebook.com',
          fullName: 'Sarah Jenkins (Facebook)',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        },
        apple: {
          email: 'chris.sterling@icloud.com',
          fullName: 'Chris Sterling (Apple ID)',
          avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        },
        github: {
          email: 'marcus.dev@github.com',
          fullName: 'Marcus Dev (GitHub)',
          avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        },
      };

      const profile = socialProfiles[provLower] || socialProfiles.google;

      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: provLower,
          ...profile,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Social login failed');

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

  const sendPhoneOtp = async (phone) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      try {
        const { error } = await supabase.auth.signInWithOtp({
          phone,
        });
        if (!error) {
          return { success: true, message: `OTP sent to ${phone}` };
        }
      } catch (e) {
        console.warn('Supabase OTP send warning:', e?.message);
      }

      const res = await fetch('/api/auth/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_otp', phone }),
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
      const supabase = createClient();
      try {
        const { data: sbData, error: sbError } = await supabase.auth.verifyOtp({
          phone,
          token: code,
          type: 'sms',
        });
        if (!sbError && sbData?.user) {
          const u = sbData.user;
          const formattedUser = {
            id: u.id,
            email: u.email || `phone.${phone.replace(/[^0-9]/g, '')}@digitalheroes.co.in`,
            fullName: fullName || u.user_metadata?.full_name || `Golfer (${phone})`,
            role: 'user',
            phone,
            avatarUrl: u.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(phone)}`,
          };
          const formattedSub = {
            id: `sub-${u.id.substring(0, 8)}`,
            userId: u.id,
            plan: 'monthly',
            status: 'active',
            priceAmount: 1999.0,
            currency: 'INR',
            currentPeriodEnd: '2026-04-01T00:00:00.000Z',
          };
          setUser(formattedUser);
          setSubscription(formattedSub);
          localStorage.removeItem('dh_signed_out');
          localStorage.setItem('dh_user', JSON.stringify(formattedUser));
          localStorage.setItem('dh_sub', JSON.stringify(formattedSub));
          return formattedUser;
        }
      } catch (e) {
        console.warn('Supabase OTP verify warning:', e?.message);
      }

      const res = await fetch('/api/auth/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phone, code, fullName }),
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

  const logout = async () => {
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
      window.location.href = '/';
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
