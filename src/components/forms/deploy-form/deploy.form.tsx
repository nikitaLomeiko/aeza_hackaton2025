import { ApiClient } from 'api/client'
import { EndpointsEnum } from 'api/model'
import React, { useState } from 'react'

interface DeployFormProps {
  onCancel?: () => void
  onSubmit?: (data: DeployRequest) => void
  dockerConfig: string
}

export interface DeployConfig {
  user: string
  host: string
  password: string
}

export interface DeployRequest {
  host: string
  user: string
  password: string
  docker_config: string
}

export const DeployForm: React.FC<DeployFormProps> = ({
  onCancel,
  onSubmit,
  dockerConfig,
}) => {
  const [formData, setFormData] = useState<DeployConfig>({
    user: '',
    host: '',
    password: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const deployingFetch = async (data: any) => {
    try {
      setIsLoading(true)
      const response = await ApiClient<ResponseType>({
        url: `${EndpointsEnum.SSH}`,
        method: 'POST',
        data: data,
      })
      return response
    } catch (error) {
      console.error('Deployment failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof DeployConfig, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.user.trim()) {
      newErrors.user = 'User is required'
    }

    if (!formData.host.trim()) {
      newErrors.host = 'Host is required'
    } else if (!isValidHost(formData.host)) {
      newErrors.host = 'Please enter a valid host (IP or domain)'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidHost = (host: string): boolean => {
    // Простая валидация хоста (IP или доменное имя)
    const hostRegex =
      /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$|^(\d{1,3}\.){3}\d{1,3}$/
    return hostRegex.test(host)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Подготавливаем данные для отправки на бекенд
    const requestData: DeployRequest = {
      host: formData.host,
      user: formData.user,
      password: formData.password,
      docker_config: dockerConfig, // Уже строка, не нужно JSON.stringify
    }

    console.log('Deploy request data:', requestData)

    try {
      await deployingFetch(requestData)
      onSubmit?.(requestData)
      onCancel?.()
    } catch (error) {
      // Обработка ошибки может быть добавлена здесь
      console.error('Deployment error:', error)
    }
  }

  // Пытаемся распарсить dockerConfig для отображения информации о сервисах
  const getServicesCount = (): number => {
    try {
      if (!dockerConfig) return 0

      // Если это YAML строка, пытаемся найти сервисы
      if (dockerConfig.includes('services:')) {
        const servicesMatch = dockerConfig.match(/services:\s*\n\s*(\w+):/g)
        return servicesMatch ? servicesMatch.length : 0
      }

      // Если это JSON строка
      const parsed = JSON.parse(dockerConfig)
      return Object.keys(parsed.services || {}).length
    } catch {
      return 0
    }
  }

  const servicesCount = getServicesCount()

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md"
    >
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Deploy Configuration
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Enter your server credentials to deploy the Docker configuration
        </p>
      </div>

      {/* User */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          User *
        </label>
        <input
          type="text"
          value={formData.user}
          onChange={(e) => handleInputChange('user', e.target.value)}
          placeholder="root"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.user
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          disabled={isLoading}
        />
        {errors.user && (
          <p className="mt-1 text-sm text-red-600">{errors.user}</p>
        )}
      </div>

      {/* Host */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Host *
        </label>
        <input
          type="text"
          value={formData.host}
          onChange={(e) => handleInputChange('host', e.target.value)}
          placeholder="192.168.1.100 or example.com"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.host
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          disabled={isLoading}
        />
        {errors.host && (
          <p className="mt-1 text-sm text-red-600">{errors.host}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder="••••••••"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.password
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Info about Docker config */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-blue-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium text-blue-800">
            Docker configuration ready for deployment
          </span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          {servicesCount > 0
            ? `${servicesCount} service(s) will be deployed`
            : 'Docker configuration is ready'}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-20"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Deploying...
            </>
          ) : (
            'Deploy'
          )}
        </button>
      </div>
    </form>
  )
}
