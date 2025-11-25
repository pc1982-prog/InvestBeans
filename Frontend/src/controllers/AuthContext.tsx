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
  // Regular auth methods
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (name: string, email: string, password: string) => Promise<User | null>;
  // Google auth methods
  loginWithGoogle: () => void;
  // Common methods
  signOut: (callback?: () => void) => Promise<void>;
  refreshUser: () => Promise<User | null>;
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
  const [authMethod, setAuthMethod] = useState<'jwt' | 'google' | null>(null);

  const isAdmin = user ? (user.isAdmin === true || ADMIN_EMAILS.includes(user.email.toLowerCase())) : false;

  const checkGoogleAuthCallback = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const googleAuth = params.get('googleAuth');
    const error = params.get('error');
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (error) {
      console.error(' Google auth error:', error);
      alert('Google authentication failed. Please try again.');
      window.history.replaceState({}, document.title, '/signin');
      return null;
    }

    if (googleAuth === 'success') {
      console.log(' Google auth success detected');

      // Extract and save tokens from URL
      if (accessToken && refreshToken) {
        console.log('✅ JWT Tokens received from callback');
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('authMethod', 'jwt');
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        setAuthMethod('jwt');
      } else {
        // Fallback to session-based auth if no tokens in URL
        localStorage.setItem('authMethod', 'google');
        setAuthMethod('google');
      }

      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);

      let attempts = 0;
      const maxAttempts = 5;
      const delayMs = 500; 

      while (attempts < maxAttempts) {
        attempts++;
        console.log(`🔄 Fetching Google profile (attempt ${attempts}/${maxAttempts})`);

        try {
        
          const { data } = await axios.get(`${getBaseURL()}/auth/profile`, {
            withCredentials: true
          });

          if (data?.success && data?.data) {
            const googleUser = data.data;
            console.log(' Google user fetched:', googleUser.email);

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
          console.log(` Attempt ${attempts} failed:`, err.response?.status, err.message);

          if (attempts === maxAttempts) {
            console.error(' Failed to fetch Google profile after all retries');
            localStorage.removeItem('authMethod');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            alert('Google login failed. Session cookie might not be set. Please try again.');
            window.location.href = '/signin';
            return null;
          }

       
          await new Promise(res => setTimeout(res, delayMs));
        }
      }
    }

    return null;
  }, []);

 
  const refreshUser = useCallback(async (): Promise<User | null> => {
    const storedAuthMethod = localStorage.getItem('authMethod') as 'jwt' | 'google' | null;

    try {
      if (storedAuthMethod === 'google') {
        console.log(' Refreshing Google session');
      
        const { data } = await axios.get(`${getBaseURL()}/auth/profile`, {
          withCredentials: true
        });

        if (data?.success && data?.data) {
          const u = data.data;
          setUser(u);
          setAuthMethod('google');
          console.log(' Google session restored:', u.email);
          return u;
        }
      } else if (storedAuthMethod === 'jwt') {
        const token = localStorage.getItem('accessToken');
        if (token) {
          console.log(' Refreshing JWT session');
          const { data } = await api.get('/users/current-user');

          if (data?.success && data?.data) {
            const u = data.data;
            setUser(u);
            setAuthMethod('jwt');
            console.log(' JWT session restored:', u.email);
            return u;
          }
        }
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.log(' No active session found');
        localStorage.removeItem('authMethod');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setAuthMethod(null);
      } else {
        console.error(' Error refreshing user:', err);
      }
    }
    return null;
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
    console.log(' Redirecting to Google OAuth');
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