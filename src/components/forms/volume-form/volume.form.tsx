import React, { useState, useEffect } from 'react'
import {
  validateVolumeConfig,
  ValidatedVolumeConfig,
} from 'schemas/dockerVolume.schema'
import type { VolumeConfig } from 'types/docker-compose.type'
import {
  addNewNode,
  changeNodeByCurrentProject,
} from 'store/project/project.store'
import { Node } from '@xyflow/react'

interface VolumeFormProps {
  initialData?: Partial<VolumeConfig>
  onCancel?: () => void
  isEdit?: boolean
  currentNode?: Node
}

export const VolumeForm: React.FC<VolumeFormProps> = ({
  initialData = {},
  onCancel,
  currentNode,
  isEdit = false,
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
  const [activeSection, setActiveSection] = useState('basic')

  // Синхронизация driverOpts с formData.driver_opts
  useEffect(() => {
    const driverOptsObject = driverOpts.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key] = value
      return acc
    }, {} as Record<string, string>)

    handleInputChange('driver_opts', driverOptsObject)
  }, [driverOpts])

  // Синхронизация labels с formData.labels
  useEffect(() => {
    const labelsObject = labels.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key] = value
      return acc
    }, {} as Record<string, string>)

    handleInputChange('labels', labelsObject)
  }, [labels])

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
  }

  const addDriverOpt = () => {
    setDriverOpts((prev) => [...prev, { key: '', value: '' }])
  }

  const removeDriverOpt = (index: number) => {
    const updated = driverOpts.filter((_, i) => i !== index)
    setDriverOpts(updated)
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
    const updated = labels.filter((_, i) => i !== index)
    setLabels(updated)
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

    const submitData: Partial<VolumeConfig> = {
      ...formData,
      driver_opts:
        Object.keys(formData.driver_opts || {}).length > 0
          ? formData.driver_opts
          : undefined,
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

    const validData = result.output as ValidatedVolumeConfig
    if (!isEdit)
      addNewNode({
        id: String(Date.now()),
        position: { x: 0, y: 0 },
        type: 'volume',
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

  const sections = [
    { id: 'basic', name: 'Basic', icon: '⚙️' },
    { id: 'options', name: 'Options', icon: '🔧' },
    { id: 'labels', name: 'Labels', icon: '🏷️' },
    { id: 'external', name: 'External', icon: '🔗' },
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
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">💾</span>
            </div>
            {isEdit ? 'Edit Volume' : 'New Volume'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure your Docker volume
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
                  ? 'bg-white shadow-md border border-blue-100 text-blue-600'
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
                  Essential volume settings
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="my-volume"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver
                  </label>
                  <input
                    type="text"
                    value={formData.driver || ''}
                    onChange={(e) =>
                      handleInputChange('driver', e.target.value)
                    }
                    placeholder="local"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.driver
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {errors.driver && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.driver}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Options Section */}
          {activeSection === 'options' && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Driver Options
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Configure volume driver options
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Driver Options
                </label>
                <div className="space-y-3">
                  {driverOpts.map((opt, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={opt.key}
                        onChange={(e) =>
                          handleDriverOptsChange(index, 'key', e.target.value)
                        }
                        placeholder="option_name"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <input
                        type="text"
                        value={opt.value}
                        onChange={(e) =>
                          handleDriverOptsChange(index, 'value', e.target.value)
                        }
                        placeholder="value"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeDriverOpt(index)}
                        className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                      >
                        <span>🗑️</span>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addDriverOpt}
                    className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>➕</span> Add Driver Option
                  </button>
                </div>
                {errors.driver_opts && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.driver_opts}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Labels Section */}
          {activeSection === 'labels' && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">Labels</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Add metadata labels to the volume
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Volume Labels
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
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <input
                        type="text"
                        value={label.value}
                        onChange={(e) =>
                          handleLabelsChange(index, 'value', e.target.value)
                        }
                        placeholder="value"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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

          {/* External Section */}
          {activeSection === 'external' && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  External Volume
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Configure external volume settings
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Volume Type
                </label>
                <div className="space-y-4">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="external"
                      checked={
                        formData.external === false ||
                        formData.external === undefined
                      }
                      onChange={() => handleExternalChange(false)}
                      className="mr-3 w-5 h-5 text-blue-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        Internal Volume
                      </div>
                      <div className="text-sm text-gray-500">
                        Managed by Docker Compose
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="external"
                      checked={
                        formData.external === true ||
                        (typeof formData.external === 'object' &&
                          formData.external !== null)
                      }
                      onChange={() => handleExternalChange(true)}
                      className="mr-3 w-5 h-5 text-blue-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        External Volume
                      </div>
                      <div className="text-sm text-gray-500">
                        Pre-existing volume
                      </div>
                    </div>
                  </label>
                </div>

                {(formData.external === true ||
                  (typeof formData.external === 'object' &&
                    formData.external !== null)) && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <p className="mt-2 text-sm text-blue-600">
                      Specify the name of the pre-existing volume
                    </p>
                  </div>
                )}
              </div>
              {errors.external && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {errors.external}
                </p>
              )}
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
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              {isEdit ? 'Update Volume' : 'Create Volume'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
