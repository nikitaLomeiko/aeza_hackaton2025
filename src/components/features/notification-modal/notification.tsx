import React from 'react'

interface NotificationProps {
  title: string
  description: string
  onAccept: () => void
  onReject: () => void
  acceptText?: string
  rejectText?: string
  type?: 'info' | 'warning' | 'success' | 'error'
  isLoading?: boolean
  variant?: 'horizontal' | 'vertical'
}

export const Notification: React.FC<NotificationProps> = ({
  title,
  description,
  onAccept,
  onReject,
  acceptText = 'Принять',
  rejectText = 'Отклонить',
  type = 'info',
  isLoading = false,
  variant = 'horizontal',
}) => {
  const typeStyles = {
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
  }

  const typeIcons = {
    info: (
      <svg
        className="w-5 h-5 text-blue-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-5 h-5 text-yellow-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    success: (
      <svg
        className="w-5 h-5 text-green-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-5 h-5 text-red-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  }

  const isHorizontal = variant === 'horizontal'

  return (
    <div className={`p-4 border rounded-lg ${typeStyles[type]} shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{typeIcons[type]}</div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{description}</p>

          <div
            className={`mt-3 flex ${isHorizontal ? 'gap-2' : 'flex-col gap-2'}`}
          >
            <button
              onClick={onAccept}
              disabled={isLoading}
              className={`px-3 py-1.5 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-1 ${
                isHorizontal ? '' : 'w-full'
              }`}
            >
              {isLoading && (
                <svg
                  className="animate-spin h-3 w-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {acceptText}
            </button>

            <button
              onClick={onReject}
              disabled={isLoading}
              className={`px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200 ${
                isHorizontal ? '' : 'w-full'
              }`}
            >
              {rejectText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
