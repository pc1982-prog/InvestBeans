import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api, { getBaseURL } from '@/api/axios';
import { AxiosError } from 'axios';

// Ensure cookies are sent with every request (safe to keep)
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
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (name: string, email: string, password: string) => Promise<User | null>;
  signOut: (callback?: () => void) => Promise<void>;
  refreshUser: () => Promise<User | null>;
  loginWithGoogle: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['admin@example.com', 'manutyagi@example.com'].map(e => e.toLowerCase());

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

  const isAdmin = user ? (user.isAdmin === true || ADMIN_EMAILS.includes(user.email.toLowerCase())) : false;

  // Google OAuth callback handler
  const checkGoogleAuthCallback = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const googleAuth = params.get('googleAuth');

    if (googleAuth === 'success') {
      console.log('✅ Google auth success detected in URL');

      localStorage.setItem('authMethod', 'google');
      window.history.replaceState({}, document.title, window.location.pathname);

      // Retry logic to wait for session cookie
      let attempts = 0;
      const maxAttempts = 8;
      const delayMs = 800;

      while (attempts < maxAttempts) {
        attempts++;
        console.log(`🔄 Attempting to fetch Google profile (${attempts}/${maxAttempts})`);

        try {
          const { data } = await api.get('/users/google-profile');

          if (data?.success && data?.data) {
            const googleUser = data.data;
            console.log('✅ Successfully fetched Google user:', googleUser.email);
            
            localStorage.setItem('user', JSON.stringify(googleUser));
            setUser(googleUser);

            // Redirect to intended page
            const redirectTo = localStorage.getItem('preAuthPath') || '/';
            localStorage.removeItem('preAuthPath');
            
            if (window.location.pathname !== redirectTo) {
              setTimeout(() => window.location.href = redirectTo, 300);
            }

            return googleUser;
          }
        } catch (err: any) {
          console.log(`⚠️ Attempt ${attempts} failed:`, err.response?.status);
          
          if (attempts === maxAttempts) {
            console.error('❌ Failed to fetch Google profile after all retries');
            localStorage.removeItem('authMethod');
            alert('Google login failed. Please try again.');
            window.location.href = '/signin';
            return null;
          }
          
          // Wait before next retry
          await new Promise(res => setTimeout(res, delayMs));
        }
      }
    } else if (googleAuth === 'failure') {
      console.log('❌ Google auth failure detected in URL');
      localStorage.removeItem('authMethod');
      window.history.replaceState({}, document.title, '/signin');
      alert('Google authentication failed');
    }
    return null;
  }, []);

  // Refresh user based on auth method
  const refreshUser = useCallback(async (): Promise<User | null> => {
    const authMethod = localStorage.getItem('authMethod');

    try {
      if (authMethod === 'google') {
        console.log('🔄 Refreshing Google user session');
        const { data } = await api.get('/users/google-profile');
        
        if (data?.success && data?.data) {
          const u = data.data;
          localStorage.setItem('user', JSON.stringify(u));
          setUser(u);
          console.log('✅ Google user session restored:', u.email);
          return u;
        }
      } else {
        const token = localStorage.getItem('accessToken');
        if (token) {
          console.log('🔄 Refreshing JWT user session');
          const { data } = await api.get('/users/current-user');
          
          if (data?.success && data?.data) {
            const u = data.data;
            localStorage.setItem('user', JSON.stringify(u));
            setUser(u);
            console.log('✅ JWT user session restored:', u.email);
            return u;
          }
        }
      }
    } catch (err: any) {
      // Only log and clear if it's a real auth error, not just "not logged in"
      if (err.response?.status === 401) {
        console.log('ℹ️ No active session found (user not logged in)');
        localStorage.removeItem('authMethod');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
      } else {
        console.error('❌ Error refreshing user:', err);
      }
    }
    return null;
  }, []);

  // Initial auth check - FIXED TO PREVENT INFINITE LOOP
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      
      // First check if there's a Google auth callback
      const hasGoogleCallback = new URLSearchParams(window.location.search).get('googleAuth');
      
      if (hasGoogleCallback) {
        // Only run Google callback check if there's a callback parameter
        await checkGoogleAuthCallback();
      } else {
        // Otherwise just try to restore existing session (no retries)
        await refreshUser();
      }
      
      setLoading(false);
    };
    
    init();
  }, []); // ✅ Empty dependency array - only run once on mount

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await api.post('/users/login', { email, password });

      const { accessToken, refreshToken, user: currentUser } = data.data;

      if (!accessToken || !currentUser) throw new Error('Login failed');

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken || '');
      localStorage.setItem('user', JSON.stringify(currentUser));
      localStorage.setItem('authMethod', 'jwt');

      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser(currentUser);

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

  const signOut = useCallback(async (callback?: () => void) => {
    const authMethod = localStorage.getItem('authMethod');

    try {
      if (authMethod === 'google') {
        await api.post('/users/google-logout');
      } else {
        await api.post('/users/logout');
      }
    } catch (err) {
      console.error('⚠️ Logout API failed (continuing anyway):', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('authMethod');
      localStorage.removeItem('preAuthPath');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      callback?.();
    }
  }, []);

  const loginWithGoogle = useCallback(() => {
    const current = window.location.pathname;
    if (!['/signin', '/signup'].includes(current)) {
      localStorage.setItem('preAuthPath', current);
    }
    console.log('🚀 Redirecting to Google OAuth...');
    window.location.href = `${getBaseURL()}/auth/google`;
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      isAdmin,
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