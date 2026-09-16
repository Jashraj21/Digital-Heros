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

  // Initialize from localStorage or default to player demo
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const isSignedOut = localStorage.getItem('dh_signed_out') === 'true';
        const storedUser = localStorage.getItem('dh_user');
        const storedSub = localStorage.getItem('dh_sub');

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

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
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
        currentPeriodStart: '2026-01-01T00:00:00.000Z',
        currentPeriodEnd: '2027-01-01T00:00:00.000Z',
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

  const loginWithSocial = async (provider = 'google', email, fullName) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: provider.toLowerCase(),
          email,
          fullName,
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

