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
      // Clear session and redirect to Haravan install
      // Redirect to client-side Login page
      const params = new URLSearchParams(window.location.search);
      // Try to get orgid from multiple sources: Session -> URL param -> Shop param
      const orgid = sessionStorage.getItem("orgid") || params.get('orgid') || params.get('shop');
      
      // Do NOT clear session here, we need the orgid!
      // sessionStorage.clear(); 
      
      if (orgid) {
        window.location.href = `/install/login?orgid=${orgid}`;
      } else {
        // If absolutely no orgid found, we might need to rely on the user reloading from Haravan Admin
        console.error("No orgid found for redirect");
      }
      
      // Return a never-resolving promise to prevent further error handling
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

export default httpClient;
