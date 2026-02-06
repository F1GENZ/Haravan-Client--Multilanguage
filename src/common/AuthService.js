import httpClient from "../config/AxiosConfig";

class AuthService {
  async login(orgid){
    try {
      return await httpClient.get(`/api/oauth/install/login?orgid=${orgid || ''}`);
    } catch (error) {
      throw error;
    }
  } 

  async install(code){ 
    try {
      const response = await httpClient.post("/api/oauth/install/grandservice", { code });
      return response; // Return response directly
    } catch (error) {
      throw error;
    }
  }

  async verifyLogin(code) {
    try {
      // Frontend -> Backend to exchange code
      return await httpClient.post(`/api/oauth/install/login/callback`, { code });
    } catch (error) {
      throw error;
    }
  }
} 
export const authService = new AuthService();