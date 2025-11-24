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
    console.error(' Request error:', error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
  
    if (import.meta.env.DEV) {
      console.log(` ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (import.meta.env.DEV) {
      console.error(` ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} - ${error.response?.status || 'Network Error'}`);
    }

 
    if (error.response?.status === 401) {
      const authMethod = localStorage.getItem('authMethod');
      const currentPath = window.location.pathname;

      const isAuthPage = currentPath === '/signin' || currentPath === '/signup';
      const isProfileCheck = originalRequest?.url?.includes('/auth/profile');
      const isTestEndpoint = originalRequest?.url?.includes('/test') || originalRequest?.url?.includes('/health');

      if (!isAuthPage && !isProfileCheck && !isTestEndpoint) {
        console.log(' Unauthorized - clearing auth data and redirecting');

        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authMethod');

       
        window.location.href = '/signin';
      }
    }

  
    if (!error.response) {
      console.error(' Network error - server might be down');

     
      if (typeof window !== 'undefined' && window.alert) {
        alert('Network error. Please check your connection and try again.');
      }
    }

    return Promise.reject(error);
  }
);

export const getBaseURL = () => {
  const raw = (import.meta.env.VITE_API_URL as string) || "http://localhost:8000/api/v1";
  const cleaned = raw.replace(/\/+$/, '').replace(/\/api(\/v\d+)?$/, '');
  console.log(' OAuth Base URL:', cleaned);
  return cleaned;
};

export default api;