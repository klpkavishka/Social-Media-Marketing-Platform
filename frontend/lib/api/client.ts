import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

class ApiClient {
  private client: AxiosInstance
  private cachedToken: string | null = null
  private tokenExpiresAt: number = 0
  private unauthorizedHandlers: Set<() => void> = new Set()

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor - attach auth token if available
    this.client.interceptors.request.use(
      async (config) => {
        if (typeof window !== 'undefined') {
          try {
            const token = await this.getAccessToken()
            if (token) {
              config.headers.Authorization = `Bearer ${token}`
            }
          } catch (error) {
            // Log token fetch error but don't block the request
            if (process.env.NODE_ENV === 'development') {
              console.warn('Failed to get access token:', error)
            }
          }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          if (!originalRequest._retry) {
            originalRequest._retry = true

            // Clear cached token
            this.cachedToken = null
            this.tokenExpiresAt = 0

            try {
              const token = await this.getAccessToken()
              if (token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
                return this.client(originalRequest)
              }
            } catch {
              // Notify all unauthorized handlers
              this.unauthorizedHandlers.forEach(handler => handler())
              
              // Show toast notification
              if (typeof window !== 'undefined') {
                toast.error('Session expired. Please log in again.')
              }
            }
          }

          // Trigger unauthorized event
          this.triggerUnauthorized()
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
          if (typeof window !== 'undefined') {
            toast.error('You do not have permission to perform this action')
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private async getAccessToken(): Promise<string | null> {
    // Return cached token if still valid (with 30s buffer)
    if (this.cachedToken && Date.now() < this.tokenExpiresAt - 30000) {
      return this.cachedToken
    }

    try {
      const response = await fetch('/api/auth/token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Token endpoint returned ${response.status}`)
        }
        return null
      }

      const data = await response.json()
      const accessToken = data.accessToken || data.token
      
      if (!accessToken) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('No access token in response:', data)
        }
        return null
      }

      this.cachedToken = accessToken
      // Cache for 55 minutes (tokens typically expire in 1 hour)
      this.tokenExpiresAt = Date.now() + 55 * 60 * 1000
      return accessToken
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Error fetching access token:', error)
      }
      this.cachedToken = null
      this.tokenExpiresAt = 0
      return null
    }
  }

  // Register handlers for unauthorized events
  onUnauthorized(handler: () => void) {
    this.unauthorizedHandlers.add(handler)
    return () => {
      this.unauthorizedHandlers.delete(handler)
    }
  }

  private triggerUnauthorized() {
    this.unauthorizedHandlers.forEach(handler => {
      try {
        handler()
      } catch (e) {
        console.error('Error in unauthorized handler:', e)
      }
    })
  }

  clearCache() {
    this.cachedToken = null
    this.tokenExpiresAt = 0
  }

  get<T>(url: string, params?: any) {
    return this.client.get<T>(url, { params })
  }

  post<T>(url: string, data?: any) {
    return this.client.post<T>(url, data)
  }

  put<T>(url: string, data?: any) {
    return this.client.put<T>(url, data)
  }

  patch<T>(url: string, data?: any) {
    return this.client.patch<T>(url, data)
  }

  delete<T>(url: string) {
    return this.client.delete<T>(url)
  }
}

export const apiClient = new ApiClient()
export default apiClient
