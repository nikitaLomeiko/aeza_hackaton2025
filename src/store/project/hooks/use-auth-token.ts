import { useEffect, useState } from 'react'
import { getQueryParam, removeQueryParams } from '../utils/query-string'

/**
 * Хук для получения токена из query string и сохранения в localStorage
 */
export const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeToken = () => {
      // 1. Пытаемся получить токен из query string
      const tokenFromQuery = getQueryParam('token')

      if (tokenFromQuery) {
        // 2. Сохраняем токен в localStorage
        localStorage.setItem('authToken', tokenFromQuery)
        setToken(tokenFromQuery)

        // 3. Очищаем token из URL
        removeQueryParams(['token'])

        console.log('Token получен из query string и сохранен')
      } else {
        // 4. Если токена нет в query string, пытаемся получить из localStorage
        const tokenFromStorage = localStorage.getItem('authToken')
        setToken(tokenFromStorage)
      }

      setIsLoading(false)
    }

    initializeToken()
  }, [])

  const saveToken = (newToken: string) => {
    localStorage.setItem('authToken', newToken)
    setToken(newToken)
  }

  const removeToken = () => {
    localStorage.removeItem('authToken')
    setToken(null)
  }

  return {
    token,
    isLoading,
    saveToken,
    removeToken,
  }
}
