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
    const hostRegex =
      /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$|^(\d{1,3}\.){3}\d{1,3}$/
    return hostRegex.test(host)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const requestData: DeployRequest = {
      host: formData.host,
      user: formData.user,
      password: formData.password,
      docker_config: dockerConfig,
    }

    console.log('Deploy request data:', requestData)

    try {
      await deployingFetch(requestData)
      onSubmit?.(requestData)
      onCancel?.()
    } catch (error) {
      console.error('Deployment error:', error)
    }
  }

  const getServicesCount = (): number => {
    try {
      if (!dockerConfig) return 0

      if (dockerConfig.includes('services:')) {
        const servicesMatch = dockerConfig.match(/services:\s*\n\s*(\w+):/g)
        return servicesMatch ? servicesMatch.length : 0
      }

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
      className="flex bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Sidebar with Info */}
      <div className="w-80 bg-gradient-to-b from-blue-50 to-gray-50 border-r border-gray-200 p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🚀</span>
            </div>
            Deploy Configuration
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Deploy your Docker configuration to a remote server
          </p>
        </div>

        {/* Configuration Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-blue-500">📦</span>
              Configuration Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Services:</span>
                <span className="font-medium text-gray-900">
                  {servicesCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Ready</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <span className="text-blue-500">💡</span>
              Requirements
            </h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• SSH access to target server</li>
              <li>• Docker installed on server</li>
              <li>• Docker Compose available</li>
              <li>• Sufficient permissions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Server Credentials
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Enter your server SSH credentials for deployment
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            {/* User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 text-xs">👤</span>
                </span>
                User *
              </label>
              <input
                type="text"
                value={formData.user}
                onChange={(e) => handleInputChange('user', e.target.value)}
                placeholder="root"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.user
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              />
              {errors.user && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {errors.user}
                </p>
              )}
            </div>

            {/* Host */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 text-xs">🌐</span>
                </span>
                Host *
              </label>
              <input
                type="text"
                value={formData.host}
                onChange={(e) => handleInputChange('host', e.target.value)}
                placeholder="192.168.1.100 or example.com"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.host
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              />
              {errors.host && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {errors.host}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 text-xs">🔒</span>
                </span>
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {errors.password}
                </p>
              )}
            </div>

            {/* Deployment Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm">📋</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">
                    Ready for Deployment
                  </h4>
                  <p className="text-sm text-blue-700">
                    {servicesCount > 0
                      ? `Ready to deploy ${servicesCount} service${
                          servicesCount > 1 ? 's' : ''
                        } to your server`
                      : 'Docker configuration is ready for deployment'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3 justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-28"
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
                <>
                  <span className="mr-2">🚀</span>
                  Deploy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
