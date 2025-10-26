import { useAuth } from 'components/features/auth/auth-provider'

/**
 * Хук для получения headers с авторизацией
 */
export const useAuthHeaders = () => {
  const { token } = useAuth()

  const getHeaders = (additionalHeaders: Record<string, string> = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...additionalHeaders,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  return {
    getHeaders,
    hasToken: !!token,
  }
}
