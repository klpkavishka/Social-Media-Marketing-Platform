import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi, LoginCredentials, RegisterData } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.access_token)
      toast.success('Login successful!')
      router.push('/dashboard')
    },
    onError: () => {
      toast.error('Invalid credentials')
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.access_token)
      toast.success('Account created successfully!')
      router.push('/dashboard')
    },
    onError: () => {
      toast.error('Registration failed')
    },
  })

  const logout = () => {
    clearAuth()
    queryClient.clear()
    router.push('/login')
    toast.success('Logged out successfully')
  }

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  }
}
