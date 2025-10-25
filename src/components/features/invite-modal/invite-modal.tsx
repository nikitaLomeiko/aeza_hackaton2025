import React, { useState } from 'react'
import { Modal } from 'components/ui/modal'
import { validateInviteData, ValidatedInviteData } from 'schemas/invite.schema'
import { ApiClient } from 'api/client'

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string // Добавляем projectId в пропсы
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (value: string) => {
    setEmail(value)

    // Очищаем ошибку при изменении поля
    if (errors.email) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.email
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Валидация через Valibot
    const result = validateInviteData({ email })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.issues) {
        const path = issue.path?.[0]?.key
        if (typeof path === 'string') {
          fieldErrors[path] = issue.message || 'Invalid value'
        }
      }
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem('authToken')

      const { data, status } = await ApiClient({
        url: `/${projectId}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (status === 200) {
        setEmail('')
        setErrors({})
        onClose()
      }
    } catch (error) {
      console.error('Ошибка при отправке приглашения:', error)
      setErrors({
        _general:
          error instanceof Error
            ? error.message
            : 'Не удалось отправить приглашение',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Пригласить в проект"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email участника
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="example@mail.com"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Мы отправим приглашение на указанный email
          </p>
        </div>

        {/* Общие ошибки */}
        {errors._general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-md">
            <p className="text-sm text-red-700">{errors._general}</p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                Отправка...
              </>
            ) : (
              'Отправить приглашение'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}
