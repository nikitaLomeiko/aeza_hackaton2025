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
  const [activeSection, setActiveSection] = useState('editor')

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
      setActiveSection('editor')
      return
    }

    if (!formData.filename.trim()) {
      setErrors({ filename: 'Filename is required' })
      setActiveSection('settings')
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
      setActiveSection('editor')
      return
    }

    onCancel?.()
  }

  const sections = [
    { id: 'editor', name: 'Editor', icon: '📝' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className="flex bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gradient-to-b from-blue-50 to-gray-50 border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">💾</span>
            </div>
            Export File
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Download your configuration
          </p>
        </div>

        <nav className="space-y-2 flex-1">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-white shadow-md border border-green-100 text-green-600'
                  : 'text-gray-600 hover:bg-white/50 hover:shadow-sm'
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <div>
                <div className="font-medium text-sm">{section.name}</div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-8">
          {/* Editor Section */}
          {activeSection === 'editor' && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Code Editor
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Write or paste your configuration code
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Configuration Code *
                </label>
                <div
                  className={`border-2 rounded-xl overflow-hidden focus-within:ring-2 transition-all ${
                    errors.code
                      ? 'border-red-300 focus-within:ring-red-500 focus-within:border-red-500'
                      : 'border-gray-200 focus-within:ring-green-500 focus-within:border-green-500'
                  }`}
                >
                  <textarea
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    placeholder="Enter your configuration code here..."
                    rows={14}
                    className="w-full px-4 py-3 resize-none focus:outline-none font-mono text-sm bg-gray-50"
                  />
                </div>
                {errors.code && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.code}
                  </p>
                )}
                <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                  <span>💡</span> Supports YAML, JSON, or any text content
                </div>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Download Settings
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Configure file export options
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filename *
                </label>
                <input
                  type="text"
                  value={formData.filename}
                  onChange={(e) =>
                    handleInputChange('filename', e.target.value)
                  }
                  placeholder="docker-compose.yml"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.filename
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:ring-green-500 focus:border-green-500'
                  }`}
                />
                {errors.filename && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.filename}
                  </p>
                )}
                <div className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                  <span>📁</span> Choose a descriptive filename for your
                  configuration
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">💡</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Export Tips</h4>
                    <ul className="mt-2 text-sm text-blue-700 space-y-1">
                      <li>• Use .yml or .yaml extension for YAML files</li>
                      <li>• Use .json extension for JSON files</li>
                      <li>• Include appropriate file headers and comments</li>
                      <li>• Validate your configuration before downloading</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
          <div className="flex gap-3 justify-between items-center">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>📊</span>
              <span>{formData.code.length} characters</span>
            </div>

            <div className="flex gap-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleDownload}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span>💾</span>
                Download File
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
