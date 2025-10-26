import React, { useState, useEffect } from 'react'
import {
  validateSecretConfig,
  ValidatedSecretConfig,
} from 'schemas/dockerSecret.schema'
import type { SecretConfig } from 'types/docker-compose.type'
import {
  addNewNode,
  changeNodeByCurrentProject,
} from 'store/project/project.store'
import { Node } from '@xyflow/react'

interface SecretFormProps {
  initialData?: Partial<SecretConfig>
  onCancel?: () => void
  isEdit?: boolean
  currentNode?: Node
}

export const SecretForm: React.FC<SecretFormProps> = ({
  initialData = {},
  onCancel,
  currentNode,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<Partial<SecretConfig>>({
    file: '',
    external: false,
    labels: {},
    name: '',
    environment: '',
    content: '',
    ...initialData,
  })

  const [labels, setLabels] = useState<{ key: string; value: string }[]>(
    Object.entries(formData.labels || {}).map(([key, value]) => ({
      key,
      value,
    }))
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeSection, setActiveSection] = useState('basic')

  const [secretSource, setSecretSource] = useState<
    'file' | 'content' | 'environment'
  >(
    formData.file
      ? 'file'
      : formData.content
      ? 'content'
      : formData.environment
      ? 'environment'
      : 'file'
  )

  // Синхронизация labels с formData.labels
  useEffect(() => {
    const labelsObject = labels.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key] = value
      return acc
    }, {} as Record<string, string>)

    handleInputChange('labels', labelsObject)
  }, [labels])

  const handleInputChange = (field: keyof SecretConfig, value: any) => {
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

  const handleLabelsChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const updated = [...labels]
    updated[index][field] = value
    setLabels(updated)
  }

  const addLabel = () => {
    setLabels((prev) => [...prev, { key: '', value: '' }])
  }

  const removeLabel = (index: number) => {
    setLabels((prev) => prev.filter((_, i) => i !== index))
  }

  const handleExternalChange = (value: boolean) => {
    if (value) {
      handleInputChange('external', true)
    } else {
      handleInputChange('external', false)
    }
  }

  const handleExternalNameChange = (name: string) => {
    handleInputChange('external', { name })
  }

  const handleSecretSourceChange = (
    source: 'file' | 'content' | 'environment'
  ) => {
    setSecretSource(source)
    // Очищаем другие поля при смене источника
    if (source === 'file') {
      handleInputChange('content', '')
      handleInputChange('environment', '')
    } else if (source === 'content') {
      handleInputChange('file', '')
      handleInputChange('environment', '')
    } else if (source === 'environment') {
      handleInputChange('file', '')
      handleInputChange('content', '')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData: Partial<SecretConfig> = {
      ...formData,
      labels:
        Object.keys(formData.labels || {}).length > 0
          ? formData.labels
          : undefined,
      external:
        typeof formData.external === 'object' && formData.external?.name
          ? formData.external
          : formData.external === true
          ? true
          : undefined,
    }

    // Валидация через Valibot
    const result = validateSecretConfig(submitData)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.issues) {
        const path = issue.path?.[0]?.key
        if (typeof path === 'string') {
          fieldErrors[path] = issue.message || 'Invalid value'
        }
      }
      setErrors(fieldErrors)

      if (!submitData.file && !submitData.content && !submitData.environment) {
        setErrors({
          ...fieldErrors,
          file: 'Either file, content, or environment must be provided',
          content: 'Either file, content, or environment must be provided',
          environment: 'Either file, content, or environment must be provided',
        })
      }
      return
    }

    // ✅ Успешная валидация
    const validData = result.output as ValidatedSecretConfig

    if (!isEdit)
      addNewNode({
        id: String(Date.now()),
        position: { x: 0, y: 0 },
        type: 'secret',
        data: { ...validData },
      })
    else
      changeNodeByCurrentProject({
        id: currentNode?.id || '',
        node: { ...currentNode, data: { ...validData } } as Node,
      })
    onCancel?.()
  }

  const sections = [
    { id: 'basic', name: 'Basic', icon: '🔐' },
    { id: 'source', name: 'Source', icon: '📁' },
    { id: 'advanced', name: 'Advanced', icon: '⚙️' },
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className="flex bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gradient-to-b from-blue-50 to-gray-50 border-r border-gray-200 p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🔒</span>
            </div>
            {isEdit ? 'Edit Secret' : 'New Secret'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure your Docker secret
          </p>
        </div>

        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-white shadow-md border border-purple-100 text-purple-600'
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
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Basic Section */}
          {activeSection === 'basic' && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Basic Configuration
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Essential secret settings
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secret Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="my-secret"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                  }`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  External Secret
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-all cursor-pointer">
                    <input
                      type="radio"
                      name="external"
                      checked={
                        formData.external === false ||
                        formData.external === undefined
                      }
                      onChange={() => handleExternalChange(false)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        Internal Secret
                      </div>
                      <div className="text-sm text-gray-500">
                        Managed by Docker Compose
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-all cursor-pointer">
                    <input
                      type="radio"
                      name="external"
                      checked={
                        formData.external === true ||
                        (typeof formData.external === 'object' &&
                          formData.external !== null)
                      }
                      onChange={() => handleExternalChange(true)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        External Secret
                      </div>
                      <div className="text-sm text-gray-500">
                        Pre-existing secret
                      </div>
                    </div>
                  </label>

                  {(formData.external === true ||
                    (typeof formData.external === 'object' &&
                      formData.external !== null)) && (
                    <div className="ml-6 mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        External Secret Name
                      </label>
                      <input
                        type="text"
                        value={
                          typeof formData.external === 'object'
                            ? formData.external.name || ''
                            : ''
                        }
                        onChange={(e) =>
                          handleExternalNameChange(e.target.value)
                        }
                        placeholder="existing-secret-name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      />
                    </div>
                  )}
                </div>
                {errors.external && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.external}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Source Section */}
          {activeSection === 'source' && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Secret Source
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Configure where the secret comes from
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-all cursor-pointer">
                  <input
                    type="radio"
                    name="secretSource"
                    checked={secretSource === 'file'}
                    onChange={() => handleSecretSourceChange('file')}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">From File</div>
                    <div className="text-sm text-gray-500">
                      Load secret from a file
                    </div>
                  </div>
                </label>

                {secretSource === 'file' && (
                  <div className="ml-6">
                    <input
                      type="text"
                      value={formData.file || ''}
                      onChange={(e) =>
                        handleInputChange('file', e.target.value)
                      }
                      placeholder="/path/to/secret/file"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.file
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                      }`}
                    />
                    {errors.file && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span> {errors.file}
                      </p>
                    )}
                  </div>
                )}

                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-all cursor-pointer">
                  <input
                    type="radio"
                    name="secretSource"
                    checked={secretSource === 'content'}
                    onChange={() => handleSecretSourceChange('content')}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      Direct Content
                    </div>
                    <div className="text-sm text-gray-500">
                      Enter secret content directly
                    </div>
                  </div>
                </label>

                {secretSource === 'content' && (
                  <div className="ml-6">
                    <input
                      value={formData.content || ''}
                      onChange={(e) =>
                        handleInputChange('content', e.target.value)
                      }
                      placeholder="Enter secret content directly..."
                      type="password"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.content
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                      }`}
                    />
                    {errors.content && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span> {errors.content}
                      </p>
                    )}
                  </div>
                )}

                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-all cursor-pointer">
                  <input
                    type="radio"
                    name="secretSource"
                    checked={secretSource === 'environment'}
                    onChange={() => handleSecretSourceChange('environment')}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      From Environment Variable
                    </div>
                    <div className="text-sm text-gray-500">
                      Use environment variable as source
                    </div>
                  </div>
                </label>

                {secretSource === 'environment' && (
                  <div className="ml-6">
                    <input
                      type="text"
                      value={formData.environment || ''}
                      onChange={(e) =>
                        handleInputChange('environment', e.target.value)
                      }
                      placeholder="ENV_VARIABLE_NAME"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.environment
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:ring-purple-500 focus:border-purple-500'
                      }`}
                    />
                    {errors.environment && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <span>⚠️</span> {errors.environment}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Advanced Section */}
          {activeSection === 'advanced' && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Advanced Configuration
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Additional secret settings
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Labels
                </label>
                <div className="space-y-3">
                  {labels.map((label, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={label.key}
                        onChange={(e) =>
                          handleLabelsChange(index, 'key', e.target.value)
                        }
                        placeholder="label_name"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      />
                      <input
                        type="text"
                        value={label.value}
                        onChange={(e) =>
                          handleLabelsChange(index, 'value', e.target.value)
                        }
                        placeholder="value"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeLabel(index)}
                        className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                      >
                        <span>🗑️</span>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLabel}
                    className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>➕</span> Add Label
                  </button>
                </div>
                {errors.labels && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.labels}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3 justify-end">
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
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              {isEdit ? 'Update Secret' : 'Create Secret'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
