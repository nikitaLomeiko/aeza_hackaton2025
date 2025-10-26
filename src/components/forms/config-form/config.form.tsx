import React, { useState } from 'react'
import {
  validateConfigConfig,
  ValidatedConfigConfig,
} from 'schemas/dockerConfig.schema'
import type { ConfigConfig } from 'types/docker-compose.type'
import {
  addNewNode,
  changeNodeByCurrentProject,
} from 'store/project/project.store'
import { Node } from '@xyflow/react'

interface ConfigFormProps {
  initialData?: Partial<ConfigConfig>
  onCancel?: () => void
  isEdit?: boolean
  currentNode?: Node
}

export const ConfigForm: React.FC<ConfigFormProps> = ({
  initialData = {},
  onCancel,
  currentNode,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<Partial<ConfigConfig>>({
    file: '',
    external: false,
    labels: {},
    name: '',
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

  const [configSource, setConfigSource] = useState<'file' | 'content'>(
    formData.file ? 'file' : 'content'
  )

  const handleInputChange = (field: keyof ConfigConfig, value: any) => {
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

    // Создаем объект лейблов только если есть хотя бы один непустой ключ
    const labelsObject = updated.reduce((acc, { key, value }) => {
      if (key.trim() !== '') acc[key] = value
      return acc
    }, {} as Record<string, string>)

    // Если объект пустой - устанавливаем undefined, иначе объект
    handleInputChange(
      'labels',
      Object.keys(labelsObject).length > 0 ? labelsObject : undefined
    )
  }

  const addLabel = () => {
    setLabels((prev) => [...prev, { key: '', value: '' }])
  }

  const removeLabel = (index: number) => {
    const updated = labels.filter((_, i) => i !== index)
    setLabels(updated)

    // После удаления пересчитываем labels объект
    const labelsObject = updated.reduce((acc, { key, value }) => {
      if (key.trim() !== '') acc[key] = value
      return acc
    }, {} as Record<string, string>)

    handleInputChange(
      'labels',
      Object.keys(labelsObject).length > 0 ? labelsObject : undefined
    )
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

  const handleConfigSourceChange = (source: 'file' | 'content') => {
    setConfigSource(source)
    // Очищаем другое поле при смене источника
    if (source === 'file') {
      handleInputChange('content', '')
    } else {
      handleInputChange('file', '')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData: Partial<ConfigConfig> = {
      ...formData,
      // labels уже обработан в handleLabelsChange и будет undefined если пустой
      external:
        typeof formData.external === 'object' && formData.external?.name
          ? formData.external
          : formData.external === true
          ? true
          : undefined,
    }

    // Объединенная проверка
    const customErrors: Record<string, string> = {}

    // Проверка на наличие file или content
    if (!submitData.file && !submitData.content) {
      customErrors.file = 'Either file or content must be provided'
      customErrors.content = 'Either file or content must be provided'
    }

    const result = validateConfigConfig(submitData)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.issues) {
        const key =
          typeof issue.path?.[0] === 'string'
            ? issue.path[0]
            : issue.path?.[0]?.key

        if (key) {
          fieldErrors[key as string] = issue.message || 'Invalid value'
        }
      }
      setErrors({ ...customErrors, ...fieldErrors })
      return
    }

    // Если есть кастомные ошибки, показываем их и выходим
    if (Object.keys(customErrors).length > 0) {
      setErrors(customErrors)
      return
    }

    // ✅ Успешная валидация
    const validData = result.output as ValidatedConfigConfig

    if (!isEdit)
      addNewNode({
        id: String(Date.now()),
        position: { x: 0, y: 0 },
        type: 'config',
        data: { ...validData },
      })
    else {
      changeNodeByCurrentProject({
        id: currentNode?.id || '',
        node: { ...currentNode, data: { ...validData } } as Node,
      })
    }
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
          Config Name *
        </label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="my-config"
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

      {/* Config Source */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Config Source *
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="configSource"
              checked={configSource === 'file'}
              onChange={() => handleConfigSourceChange('file')}
              className="mr-2"
            />
            <span>From File</span>
          </label>
          {configSource === 'file' && (
            <div className="ml-6">
              <input
                type="text"
                value={formData.file || ''}
                onChange={(e) => handleInputChange('file', e.target.value)}
                placeholder="/path/to/config/file"
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
              name="configSource"
              checked={configSource === 'content'}
              onChange={() => handleConfigSourceChange('content')}
              className="mr-2"
            />
            <span>Direct Content</span>
          </label>
          {configSource === 'content' && (
            <div className="ml-6">
              <textarea
                value={formData.content || ''}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter config content directly..."
                rows={6}
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
        </div>
      </div>

      {/* External */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          External Config
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
            External (pre-existing config)
          </label>

          {(formData.external === true ||
            (typeof formData.external === 'object' &&
              formData.external !== null)) && (
            <div className="ml-6 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                External Config Name
              </label>
              <input
                type="text"
                value={
                  typeof formData.external === 'object'
                    ? formData.external.name || ''
                    : ''
                }
                onChange={(e) => handleExternalNameChange(e.target.value)}
                placeholder="existing-config-name"
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
          {isEdit ? 'Update Config' : 'Create Config'}
        </button>
      </div>
    </form>
  )
}
