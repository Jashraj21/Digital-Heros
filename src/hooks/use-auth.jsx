'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  subscription: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  loginAsDemo: async () => {},
  loginWithSocial: async () => {},
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
    try {
      const storedUser = localStorage.getItem('dh_user');
      const storedSub = localStorage.getItem('dh_sub');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        if (storedSub) setSubscription(JSON.parse(storedSub));
      } else {
        // Default demo session for fast review
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
        setUser(defaultUser);
        setSubscription(defaultSub);
        localStorage.setItem('dh_user', JSON.stringify(defaultUser));
        localStorage.setItem('dh_sub', JSON.stringify(defaultSub));
      }
    } catch (e) {
      console.error('Error loading session:', e);
    } finally {
      setIsLoading(false);
    }
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
    localStorage.setItem('dh_user', JSON.stringify(demoUser));
    localStorage.setItem('dh_sub', JSON.stringify(demoSub));
    return demoUser;
  };

  const loginWithSocial = async (provider = 'google') => {
    setIsLoading(true);
    try {
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

      const profile = socialProfiles[provider.toLowerCase()] || socialProfiles.google;

      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          ...profile,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Social login failed');

      setUser(data.user);
      setSubscription(data.subscription);
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
      localStorage.setItem('dh_user', JSON.stringify(data.user));
      if (data.subscription) {
        localStorage.setItem('dh_sub', JSON.stringify(data.subscription));
      }
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setSubscription(null);
    localStorage.removeItem('dh_user');
    localStorage.removeItem('dh_sub');
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
