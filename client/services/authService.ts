import axios, { AxiosInstance } from 'axios';

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true,
    });
  }

  async signup(email: string, password: string, name: string) {
    const response = await this.api.post('/auth/signup', { email, password, name });
    return response.data;
  }

  async forgotPassword(email: string) {
    const response = await this.api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token: string, password: string) {
    const response = await this.api.post(`/auth/reset-password?token=${token}`, { password });
    return response.data;
  }

  async verifyEmail(token: string) {
    const response = await this.api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  }
}

export const authService = new AuthService();
