import axios from "axios";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});

httpClient.interceptors.request.use(
  async (config) => {
    // Delay 500ms before every request to reduce server load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const orgid = sessionStorage.getItem("orgid");
    if (orgid) config.params = { ...config.params, orgid: orgid };
    return config;
  },
  (err) => Promise.reject(err)
);

export default httpClient;
