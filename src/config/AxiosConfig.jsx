import axios from "axios";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});

httpClient.interceptors.request.use(
  async (config) => {
    // Delay 500ms before every request to reduce server load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const orgid = sessionStorage.getItem("orgid");
    if (orgid) {
      config.params = { ...config.params, orgid: orgid };
      config.headers['x-orgid'] = orgid; // Add header for backend
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor - handle 401 errors
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const orgid = sessionStorage.getItem("orgid");
      // Redirect to login page
      window.location.href = `/install/login?orgid=${orgid || ''}`;
    }
    return Promise.reject(error);
  }
);

export default httpClient;
