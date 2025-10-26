import React, { createContext, useContext, useEffect } from 'react'
import { useAuthToken } from 'store/project/hooks/use-auth-token'

interface AuthContextType {
  token: string | null
  isLoading: boolean
  saveToken: (token: string) => void
  removeToken: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, isLoading, saveToken, removeToken } = useAuthToken()
  const isAuthenticated = !!token

  // Можно добавить здесь дополнительную логику, например, проверку валидности токена
  useEffect(() => {
    if (token) {
      // Проверяем валидность токена (если нужно)
      console.log('Токен получен:', token)
    }
  }, [token])

  const value = {
    token,
    isLoading,
    saveToken,
    removeToken,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
