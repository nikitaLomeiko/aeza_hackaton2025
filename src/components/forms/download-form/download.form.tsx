import React, { useState } from 'react'

interface CodeEditorFormProps {
  initialData?: { code?: string; filename?: string }
  onCancel?: () => void
}

export const DownloadForm: React.FC<CodeEditorFormProps> = ({
  initialData = {},
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    code: '',
    filename: 'file.yaml',
    ...initialData,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof typeof formData, value: string) => {
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

  const handleDownload = () => {
    if (!formData.code.trim()) {
      setErrors({ code: 'Code cannot be empty' })
      return
    }

    if (!formData.filename.trim()) {
      setErrors({ filename: 'Filename is required' })
      return
    }

    // Создаем Blob и скачиваем файл
    const blob = new Blob([formData.code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = formData.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code.trim()) {
      setErrors({ code: 'Code cannot be empty' })
      return
    }

    onCancel?.()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md"
    >
      {/* Filename */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filename *
        </label>
        <input
          type="text"
          value={formData.filename}
          onChange={(e) => handleInputChange('filename', e.target.value)}
          placeholder="docker-compose.yml"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.filename
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {errors.filename && (
          <p className="mt-1 text-sm text-red-600">{errors.filename}</p>
        )}
      </div>

      {/* Code Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Code *
        </label>
        <div
          className={`border rounded-md focus-within:ring-2 focus-within:ring-blue-500 ${
            errors.code ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <textarea
            value={formData.code}
            onChange={(e) => handleInputChange('code', e.target.value)}
            placeholder="Enter your code here..."
            rows={12}
            className="w-full px-3 py-2 resize-none focus:outline-none font-mono text-sm"
          />
        </div>
        {errors.code && (
          <p className="mt-1 text-sm text-red-600">{errors.code}</p>
        )}
        <div className="mt-1 text-xs text-gray-500">
          Supports YAML, JSON, or any text content
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Download File
          </button>
        </div>

        <div className="flex gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save as Node
          </button>
        </div>
      </div>
    </form>
  )
}
