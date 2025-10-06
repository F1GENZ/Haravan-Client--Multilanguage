import httpClient from "../config/AxiosConfig";

class AuthService {
  async login(orgid){
    try {
      return await httpClient.get(`/api/oauth/install/login`);
    } catch (error) {
      throw error;
    }
  } 

  async install(code){ 
    try {
      const response = await httpClient.post("/api/oauth/install/grandservice", { code });
      return this.toResult(response);
    } catch (error) {
      return this.toResultError(error);
    }
  }
} 
export const authService = new AuthService();