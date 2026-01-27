import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api, { getBaseURL } from '@/api/axios';
import axios from 'axios';
import { AxiosError } from 'axios';

api.defaults.withCredentials = true;

type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  googleId?: string;
  createdAt?: string;
  updatedAt?: string;
  isAdmin?: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authMethod: 'jwt' | 'google' | null;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (name: string, email: string, password: string) => Promise<User | null>;
  loginWithGoogle: () => void;
  signOut: (callback?: () => void) => Promise<void>;
  refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['admin@example.com', 'superadmin@example.com'].map(e => e.toLowerCase());

function getErrorMessage(err: unknown): string {
  if (!err) return 'Unknown error';
  if ((err as AxiosError).isAxiosError) {
    const axiosErr = err as AxiosError;
    const resp = axiosErr.response as any;
    return resp?.data?.message || resp?.data?.error || axiosErr.message;
  }
  if (err instanceof Error) return err.message;
  return String(err);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authMethod, setAuthMethod] = useState<'jwt' | 'google' | null>(null);

  const isAdmin = user ? (user.isAdmin === true || ADMIN_EMAILS.includes(user.email.toLowerCase())) : false;

  // ✅ FIXED: Google OAuth callback handler using JWT tokens
  const checkGoogleAuthCallback = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const googleAuth = params.get('googleAuth');
    const error = params.get('error');
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (error) {
      console.error('❌ Google auth error:', error);
      alert('Google authentication failed. Please try again.');
      window.history.replaceState({}, document.title, '/signin');
      return null;
    }

    if (googleAuth === 'success') {
      console.log('✅ Google auth success detected');

      if (accessToken && refreshToken) {
        console.log('✅ JWT Tokens received from callback');
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('authMethod', 'jwt');
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setAuthMethod('jwt');

        // Clear URL params
        window.history.replaceState({}, document.title, window.location.pathname);

        try {
          // ✅ FIXED: Fetch user profile using JWT token (not session cookie)
          const { data } = await api.get('/users/current-user');

          if (data?.success && data?.data) {
            const googleUser = data.data;
            console.log('✅ Google user fetched:', googleUser.email);
            setUser(googleUser);

            // Redirect to intended page
            const redirectTo = localStorage.getItem('preAuthPath') || '/';
            localStorage.removeItem('preAuthPath');

            if (window.location.pathname !== redirectTo) {
              setTimeout(() => {
                window.location.href = redirectTo;
              }, 100);
            }

            return googleUser;
          }
        } catch (err: any) {
          console.error('❌ Failed to fetch Google profile:', err);
          localStorage.removeItem('authMethod');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          alert('Failed to fetch user profile. Please try again.');
          window.location.href = '/signin';
          return null;
        }
      } else {
        console.error('❌ No tokens in callback URL');
        alert('Authentication failed. No tokens received.');
        window.location.href = '/signin';
        return null;
      }
    }

    return null;
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      // Step 1: Try Google session first (withCredentials, no token)
      try {
        const { data } = await axios.get(`${getBaseURL()}/auth/profile`, { withCredentials: true });
        if (data?.success && data?.data) {
          setUser(data.data);
          localStorage.setItem('authMethod', 'google');
          setAuthMethod('google');
          console.log('✅ Google session restored');
          return data.data;
        }
      } catch (sessionErr) {
        console.log('No Google session, trying JWT...');
      }

      // Step 2: Fallback to JWT (sets header if token exists)
      const token = localStorage.getItem('accessToken');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await api.get('/users/current-user');
        if (data?.success && data?.data) {
          setUser(data.data);
          localStorage.setItem('authMethod', 'jwt');
          setAuthMethod('jwt');
          console.log('✅ JWT restored');
          return data.data;
        }
      }

      // No auth
      throw new Error('No session');
    } catch (err: any) {
      if (err.response?.status === 401 || err.message === 'No session') {
        console.log('No active auth, clearing...');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authMethod');
        setUser(null);
        setAuthMethod(null);
        delete api.defaults.headers.common['Authorization'];
      }
      return null;
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const hasGoogleCallback = new URLSearchParams(window.location.search).get('googleAuth');

      if (hasGoogleCallback) {
        await checkGoogleAuthCallback();
      } else {
        await refreshUser();
      }

      setLoading(false);
    };

    init();
  }, []); 

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await api.post('/users/login', { email, password });

      const { accessToken, refreshToken, user: currentUser } = data.data;

      if (!accessToken || !currentUser) throw new Error('Login failed');

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken || '');
      localStorage.setItem('authMethod', 'jwt');

      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser(currentUser);
      setAuthMethod('jwt');

      return currentUser;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    try {
      await api.post('/users/register', { name, email, password });
      return await signIn(email, password);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  }, [signIn]);

  const loginWithGoogle = useCallback(() => {
    const current = window.location.pathname;
    if (!['/signin', '/signup'].includes(current)) {
      localStorage.setItem('preAuthPath', current);
    }
    console.log('🔄 Redirecting to Google OAuth');
    window.location.href = `${getBaseURL()}/auth/google`;
  }, []);

  const signOut = useCallback(async (callback?: () => void) => {
    const method = authMethod || localStorage.getItem('authMethod');

    try {
      if (method === 'google') {
        await axios.post(`${getBaseURL()}/auth/logout`, {}, {
          withCredentials: true
        });
      } else {
        await api.post('/users/logout');
      }
    } catch (err) {
      console.error('⚠️ Logout API failed:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authMethod');
      localStorage.removeItem('preAuthPath');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setAuthMethod(null);
      callback?.();
    }
  }, [authMethod]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      isAdmin,
      authMethod,
      signIn,
      signUp,
      signOut,
      refreshUser,
      loginWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};