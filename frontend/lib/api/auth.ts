import { apiClient } from './client'

// Auth0 handles login/register/token refresh automatically
// These API calls are for interacting with your backend's user-related endpoints

export const authApi = {
  // Get current user profile from backend
  me: () => apiClient.get('/auth/me'),

  // Update user profile on backend
  updateProfile: (data: {
    firstName?: string
    lastName?: string
    universityName?: string
    department?: string
    jobTitle?: string
  }) => apiClient.patch('/auth/profile', data),

  // Sync Auth0 user with backend (called after first login)
  syncUser: (auth0Profile: {
    sub: string
    email: string
    name?: string
    picture?: string
  }) => apiClient.post('/auth/sync', auth0Profile),
}
