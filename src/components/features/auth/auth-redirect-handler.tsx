import React, { useEffect, useState } from 'react'
import { useAuth } from './auth-provider'
import { getQueryParam, removeQueryParams } from 'store/project'

export const AuthRedirectHandler: React.FC = () => {
  const { token, isLoading, saveToken } = useAuth()
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const handleRedirect = () => {
      const tokenFromQuery = getQueryParam('token')

      if (tokenFromQuery) {
        setMessage('Обработка авторизации...')

        // Сохраняем токен (это автоматически вызовется в useAuthToken)
        saveToken(tokenFromQuery)

        // Очищаем URL
        removeQueryParams(['token'])

        setMessage('Авторизация успешна! Перенаправление...')

        // Можно добавить дополнительную логику после успешной авторизации
        setTimeout(() => {
          setMessage('')
        }, 2000)
      }
    }

    handleRedirect()
  }, [saveToken])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (message) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg border">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    )
  }

  return null
}
