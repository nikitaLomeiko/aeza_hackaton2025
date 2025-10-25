import React, { useState } from 'react'
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

    const labelsObject = updated.reduce((acc, { key, value }) => {
      if (key) acc[key] = value
      return acc
    }, {} as Record<string, string>)

    handleInputChange('labels', labelsObject)
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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md"
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secret Name *
        </label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="my-secret"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Secret Source */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secret Source *
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="secretSource"
              checked={secretSource === 'file'}
              onChange={() => handleSecretSourceChange('file')}
              className="mr-2"
            />
            <span>From File</span>
          </label>
          {secretSource === 'file' && (
            <div className="ml-6">
              <input
                type="text"
                value={formData.file || ''}
                onChange={(e) => handleInputChange('file', e.target.value)}
                placeholder="/path/to/secret/file"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.file
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.file && (
                <p className="mt-1 text-sm text-red-600">{errors.file}</p>
              )}
            </div>
          )}

          <label className="flex items-center">
            <input
              type="radio"
              name="secretSource"
              checked={secretSource === 'content'}
              onChange={() => handleSecretSourceChange('content')}
              className="mr-2"
            />
            <span>Direct Content</span>
          </label>
          {secretSource === 'content' && (
            <div className="ml-6">
              <input
                value={formData.content || ''}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter secret content directly..."
                type="password"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.content
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>
          )}

          <label className="flex items-center">
            <input
              type="radio"
              name="secretSource"
              checked={secretSource === 'environment'}
              onChange={() => handleSecretSourceChange('environment')}
              className="mr-2"
            />
            <span>From Environment Variable</span>
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.environment
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.environment && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.environment}
                </p>
              )}
            </div>
          )}
        </div>
        {errors.file && !errors.file.includes('Either') && (
          <p className="mt-1 text-sm text-red-600">{errors.file}</p>
        )}
      </div>

      {/* External */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          External Secret
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="external"
              checked={
                formData.external === false || formData.external === undefined
              }
              onChange={() => handleExternalChange(false)}
              className="mr-2"
            />
            Internal (managed by Docker Compose)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="external"
              checked={
                formData.external === true ||
                (typeof formData.external === 'object' &&
                  formData.external !== null)
              }
              onChange={() => handleExternalChange(true)}
              className="mr-2"
            />
            External (pre-existing secret)
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
                onChange={(e) => handleExternalNameChange(e.target.value)}
                placeholder="existing-secret-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
        {errors.external && (
          <p className="mt-1 text-sm text-red-600">{errors.external}</p>
        )}
      </div>

      {/* Labels */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Labels
        </label>
        <div className="space-y-2">
          {labels.map((label, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={label.key}
                onChange={(e) =>
                  handleLabelsChange(index, 'key', e.target.value)
                }
                placeholder="label_name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={label.value}
                onChange={(e) =>
                  handleLabelsChange(index, 'value', e.target.value)
                }
                placeholder="value"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeLabel(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLabel}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Label
          </button>
        </div>
        {errors.labels && (
          <p className="mt-1 text-sm text-red-600">{errors.labels}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
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
          Create Secret
        </button>
      </div>
    </form>
  )
}
