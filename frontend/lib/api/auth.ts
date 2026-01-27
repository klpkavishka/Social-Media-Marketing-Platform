import { apiClient } from './client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  universityName: string
  role: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    universityId: string
  }
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>('/auth/login', credentials),

  register: (data: RegisterData) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  logout: () => apiClient.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    apiClient.post<{ access_token: string }>('/auth/refresh', { refreshToken }),

  me: () => apiClient.get('/auth/me'),
}
