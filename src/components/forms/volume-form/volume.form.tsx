import React, { useState } from 'react'
import {
  validateVolumeConfig,
  ValidatedVolumeConfig,
} from 'schemas/dockerVolume.schema'
import type { VolumeConfig } from 'types/docker-compose.type'
import { addNewNode } from 'store/project/project.store'

interface VolumeFormProps {
  initialData?: Partial<VolumeConfig>
  onCancel?: () => void
}

export const VolumeForm: React.FC<VolumeFormProps> = ({
  initialData = {},
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<VolumeConfig>>({
    driver: '',
    driver_opts: {},
    external: false,
    labels: {},
    name: '',
    ...initialData,
  })

  const [driverOpts, setDriverOpts] = useState<
    { key: string; value: string }[]
  >(
    Object.entries(formData.driver_opts || {}).map(([key, value]) => ({
      key,
      value,
    }))
  )

  const [labels, setLabels] = useState<{ key: string; value: string }[]>(
    Object.entries(formData.labels || {}).map(([key, value]) => ({
      key,
      value,
    }))
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof VolumeConfig, value: any) => {
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

  const handleDriverOptsChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const updated = [...driverOpts]
    updated[index][field] = value
    setDriverOpts(updated)

    const driverOptsObject = updated.reduce((acc, { key, value }) => {
      if (key) acc[key] = value
      return acc
    }, {} as Record<string, string>)

    handleInputChange('driver_opts', driverOptsObject)
  }

  const addDriverOpt = () => {
    setDriverOpts((prev) => [...prev, { key: '', value: '' }])
  }

  const removeDriverOpt = (index: number) => {
    setDriverOpts((prev) => prev.filter((_, i) => i !== index))
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Подготавливаем данные для отправки
    const submitData: Partial<VolumeConfig> = {
      ...formData,
      // Очищаем пустые объекты
      driver_opts:
        Object.keys(formData.driver_opts || {}).length > 0
          ? formData.driver_opts
          : undefined,
      labels:
        Object.keys(formData.labels || {}).length > 0
          ? formData.labels
          : undefined,
      // Для external: если это объект с пустым name, преобразуем в true
      external:
        typeof formData.external === 'object' && formData.external?.name
          ? formData.external
          : formData.external === true
          ? true
          : undefined,
    }

    // Валидация через Valibot
    const result = validateVolumeConfig(submitData)

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

    // ✅ Успешная валидация
    const validData = result.output as ValidatedVolumeConfig
    addNewNode({
      id: String(Date.now()),
      position: { x: 0, y: 0 },
      type: 'volume',
      data: { ...validData },
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
          Volume Name
        </label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="my-volume"
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

      {/* Driver */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Driver
        </label>
        <input
          type="text"
          value={formData.driver || ''}
          onChange={(e) => handleInputChange('driver', e.target.value)}
          placeholder="local"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.driver
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {errors.driver && (
          <p className="mt-1 text-sm text-red-600">{errors.driver}</p>
        )}
      </div>

      {/* Driver Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Driver Options
        </label>
        <div className="space-y-2">
          {driverOpts.map((opt, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={opt.key}
                onChange={(e) =>
                  handleDriverOptsChange(index, 'key', e.target.value)
                }
                placeholder="option_name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={opt.value}
                onChange={(e) =>
                  handleDriverOptsChange(index, 'value', e.target.value)
                }
                placeholder="value"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeDriverOpt(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addDriverOpt}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Driver Option
          </button>
        </div>
        {errors.driver_opts && (
          <p className="mt-1 text-sm text-red-600">{errors.driver_opts}</p>
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

      {/* External */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          External Volume
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
            External (pre-existing volume)
          </label>

          {(formData.external === true ||
            (typeof formData.external === 'object' &&
              formData.external !== null)) && (
            <div className="ml-6 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                External Volume Name
              </label>
              <input
                type="text"
                value={
                  typeof formData.external === 'object'
                    ? formData.external.name || ''
                    : ''
                }
                onChange={(e) => handleExternalNameChange(e.target.value)}
                placeholder="existing-volume-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
        {errors.external && (
          <p className="mt-1 text-sm text-red-600">{errors.external}</p>
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
          Create Volume
        </button>
      </div>
    </form>
  )
}
