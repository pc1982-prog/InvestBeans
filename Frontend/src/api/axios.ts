import axios from "axios";

const RAW = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";
let BASE = RAW.replace(/\/+$/, "");

// Ensure /api/v1 is at the end for API calls
if (!/\/api\/v1$/.test(BASE)) {
  if (/\/api$/.test(BASE)) {
    BASE = BASE + "/v1";
  } else {
    BASE = BASE + "/api/v1";
  }
}

console.log('API Base URL:', BASE);

const api = axios.create({
  baseURL: BASE,
  withCredentials: true, // ✅ CRITICAL: Must send cookies
  headers: { 
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const authMethod = localStorage.getItem('authMethod');
    
    // Only add Bearer token for JWT auth, not for Google OAuth
    if (token && authMethod !== 'google') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ✅ Always ensure credentials are sent
    config.withCredentials = true;
    
    // Log request for debugging
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error(`❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} - ${error.response?.status || 'Network Error'}`);
    
    if (error.response?.status === 401) {
      const authMethod = localStorage.getItem('authMethod');
      
      // Don't redirect if it's a Google profile check (user might not be logged in)
      if (originalRequest?.url?.includes('/google-profile')) {
        console.log('🔍 Google profile check failed - user not logged in');
        return Promise.reject(error);
      }
      
      // Don't redirect if already on auth pages
      const currentPath = window.location.pathname;
      if (currentPath === '/signin' || currentPath === '/signup') {
        return Promise.reject(error);
      }
      
      // Token expired or invalid - clear and redirect to login
      console.log('🔒 Unauthorized - clearing auth data');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('authMethod');
      
      // Redirect to login
      window.location.href = '/signin';
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network error - server might be down');
      // You could show a toast notification here
    }
    
    return Promise.reject(error);
  }
);

// Helper to get base URL without /api/v1 for OAuth routes
export const getBaseURL = () => {
  const raw = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";
  const cleaned = raw.replace(/\/+$/, '').replace(/\/api(\/v\d+)?$/, '');
  console.log('OAuth Base URL:', cleaned);
  return cleaned;
};

export default api;