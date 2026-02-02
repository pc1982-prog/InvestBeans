import axios from "axios";

const RAW = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";
let BASE = RAW.replace(/\/+$/, "");

if (!/\/api\/v1$/.test(BASE)) {
  if (/\/api$/.test(BASE)) {
    BASE = BASE + "/v1";
  } else {
    BASE = BASE + "/api/v1";
  }
}

console.log('📡 API Base URL:', BASE);

const api = axios.create({
  baseURL: BASE,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const authMethod = localStorage.getItem('authMethod');

    if (token && authMethod === 'jwt') {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.withCredentials = true;

    if (import.meta.env.DEV) {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (import.meta.env.DEV) {
      console.error(`❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} - ${error.response?.status || 'Network Error'}`);
    }

    // ✅ FIXED: Handle 401 errors more intelligently
    if (error.response?.status === 401) {
      const authMethod = localStorage.getItem('authMethod');
      const currentPath = window.location.pathname;

      const isAuthPage = currentPath === '/signin' || 
                         currentPath === '/signup' || 
                         currentPath === '/forgot-password' || 
                         currentPath.startsWith('/reset-password');
      
      const isProfileCheck = originalRequest?.url?.includes('/auth/profile') || 
                             originalRequest?.url?.includes('/users/current-user');
      
      const isTestEndpoint = originalRequest?.url?.includes('/test') || 
                             originalRequest?.url?.includes('/health');

      // ✅ FIXED: Don't redirect if:
      // - Already on auth page
      // - Just checking if user is logged in (profile check)
      // - Testing endpoint health
      if (!isAuthPage && !isProfileCheck && !isTestEndpoint) {
        console.log('🔒 Unauthorized - clearing auth data and redirecting');

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authMethod');

        window.location.href = '/signin';
      } else if (isProfileCheck) {
        // ✅ Profile checks failing with 401 is NORMAL for logged-out users
        // Don't log this as an error or show alerts
        console.log('ℹ️ No active session (expected when logged out)');
      }
    }

    // ✅ FIXED: Better network error handling
    if (!error.response) {
      console.error('🌐 Network error - server might be down');

      // ✅ Only show alert for actual network failures on important requests
      const isImportantRequest = originalRequest?.url && 
        !originalRequest.url.includes('/auth/profile') &&
        !originalRequest.url.includes('/users/current-user') &&
        !originalRequest.url.includes('/health');

      if (isImportantRequest && typeof window !== 'undefined' && window.alert) {
        alert('Network error. Please check your connection and try again.');
      }
    }

    return Promise.reject(error);
  }
);

export const getBaseURL = () => {
  const raw = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000";
  // ✅ FIXED: More robust base URL cleaning
  let cleaned = raw.replace(/\/+$/, '');
  
  // Remove /api/v1 or /api suffix if present
  cleaned = cleaned.replace(/\/api(\/v\d+)?$/, '');
  
  console.log('🔗 OAuth Base URL:', cleaned);
  return cleaned;
};

export default api;