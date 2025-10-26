import React, { useState, useEffect } from 'react'
import {
  validateServiceConfig,
  ValidatedServiceConfig,
} from 'schemas/dockerService.schema'
import type { PortMapping, ServiceConfig } from 'types/docker-compose.type'
import {
  addNewNode,
  changeNodeByCurrentProject,
} from 'store/project/project.store'
import { Node } from '@xyflow/react'

interface ServiceFormProps {
  initialData?: Partial<ServiceConfig>
  onCancel?: () => void
  isEdit?: boolean
  currentNode?: Node
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData = {},
  onCancel,
  isEdit = false,
  currentNode,
}) => {
  const [formData, setFormData] = useState<Partial<ServiceConfig>>({
    image: '',
    container_name: '',
    ports: [],
    environment: {},
    restart: 'unless-stopped',
    command: '',
    entrypoint: '',
    user: '',
    working_dir: '',
    ...initialData,
  })

  const [environmentVars, setEnvironmentVars] = useState<
    { key: string; value: string }[]
  >(
    Object.entries(formData.environment || {}).map(([key, value]) => ({
      key,
      value,
    }))
  )

  const [ports, setPorts] = useState<PortMapping[]>(
    Array.isArray(formData.ports) ? formData.ports : []
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeSection, setActiveSection] = useState('basic')

  // Синхронизация environmentVars с formData.environment
  useEffect(() => {
    const envObject = environmentVars.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key] = value
      return acc
    }, {} as Record<string, string>)

    handleInputChange('environment', envObject)
  }, [environmentVars])

  // Синхронизация ports с formData.ports
  useEffect(() => {
    const validPorts = ports.filter((port) => port.trim())
    handleInputChange('ports', validPorts)
  }, [ports])

  const handleInputChange = (field: keyof ServiceConfig, value: any) => {
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

  const handleEnvironmentChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const updated = [...environmentVars]
    updated[index][field] = value
    setEnvironmentVars(updated)
  }

  const addEnvironmentVar = () => {
    setEnvironmentVars((prev) => [...prev, { key: '', value: '' }])
  }

  const removeEnvironmentVar = (index: number) => {
    const updated = environmentVars.filter((_, i) => i !== index)
    setEnvironmentVars(updated)
  }

  const handlePortChange = (index: number, value: string) => {
    const updated = [...ports]
    updated[index] = value
    setPorts(updated)
  }

  const addPort = () => {
    setPorts((prev) => [...prev, ''])
  }

  const removePort = (index: number) => {
    const updated = ports.filter((_, i) => i !== index)
    setPorts(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData: Partial<ServiceConfig> = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => {
        if (Array.isArray(value)) return value.length > 0
        if (typeof value === 'object')
          return Object.keys(value || {}).length > 0
        return value !== '' && value !== undefined
      })
    )

    const result = validateServiceConfig(submitData)

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

    const validData = result.output as ValidatedServiceConfig

    if (!isEdit)
      addNewNode({
        id: String(Date.now()),
        position: { x: 0, y: 0 },
        type: 'service',
        data: { ...validData },
      })
    else {
      changeNodeByCurrentProject({
        id: currentNode?.id || '',
        node: {
          ...currentNode,
          data: { ...validData, volumes: currentNode?.data.volumes },
        } as Node,
      })
    }
    onCancel?.()
  }

  const sections = [
    { id: 'basic', name: 'Basic', icon: '⚙️' },
    { id: 'network', name: 'Network', icon: '🌐' },
    { id: 'environment', name: 'Environment', icon: '🔧' },
    { id: 'advanced', name: 'Advanced', icon: '🚀' },
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gradient-to-b from-blue-50 to-gray-50 border-r border-gray-200 p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🐳</span>
            </div>
            {isEdit ? 'Edit Service' : 'New Service'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure your Docker service
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
                  Essential service settings
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image *
                  </label>
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="nginx:alpine"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.image
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {errors.image && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.image}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Container Name
                  </label>
                  <input
                    type="text"
                    value={formData.container_name || ''}
                    onChange={(e) =>
                      handleInputChange('container_name', e.target.value)
                    }
                    placeholder="my-container"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.container_name
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {errors.container_name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.container_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restart Policy
                  </label>
                  <select
                    value={formData.restart || 'unless-stopped'}
                    onChange={(e) =>
                      handleInputChange('restart', e.target.value)
                    }
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.restart
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  >
                    <option value="no">No</option>
                    <option value="always">Always</option>
                    <option value="on-failure">On Failure</option>
                    <option value="unless-stopped">Unless Stopped</option>
                  </select>
                  {errors.restart && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.restart}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User
                  </label>
                  <input
                    type="text"
                    value={formData.user || ''}
                    onChange={(e) => handleInputChange('user', e.target.value)}
                    placeholder="root"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Network Section */}
          {activeSection === 'network' && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Network Configuration
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Port mappings and networking
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Port Mappings
                </label>
                <div className="space-y-3">
                  {ports.map((port, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={port}
                        onChange={(e) =>
                          handlePortChange(index, e.target.value)
                        }
                        placeholder="8080:80"
                        className={`flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.ports
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => removePort(index)}
                        className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                      >
                        <span>🗑️</span>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPort}
                    className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>➕</span> Add Port Mapping
                  </button>
                </div>
                {errors.ports && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.ports}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Environment Section */}
          {activeSection === 'environment' && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Environment Variables
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Configure service environment
                </p>
              </div>

              <div className="space-y-4">
                {environmentVars.map((env, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={env.key}
                      onChange={(e) =>
                        handleEnvironmentChange(index, 'key', e.target.value)
                      }
                      placeholder="VARIABLE_NAME"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <input
                      type="text"
                      value={env.value}
                      onChange={(e) =>
                        handleEnvironmentChange(index, 'value', e.target.value)
                      }
                      placeholder="value"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => removeEnvironmentVar(index)}
                      className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                    >
                      <span>🗑️</span>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEnvironmentVar}
                  className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <span>➕</span> Add Environment Variable
                </button>
              </div>
              {errors.environment && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {errors.environment}
                </p>
              )}
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
                  Additional service settings
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Command
                  </label>
                  <input
                    type="text"
                    value={
                      Array.isArray(formData.command)
                        ? formData.command.join(' ')
                        : formData.command || ''
                    }
                    onChange={(e) =>
                      handleInputChange('command', e.target.value.split(' '))
                    }
                    placeholder="npm start"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entrypoint
                  </label>
                  <input
                    type="text"
                    value={
                      Array.isArray(formData.entrypoint)
                        ? formData.entrypoint.join(' ')
                        : formData.entrypoint || ''
                    }
                    onChange={(e) =>
                      handleInputChange('entrypoint', e.target.value.split(' '))
                    }
                    placeholder="/bin/sh -c"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working Directory
                </label>
                <input
                  type="text"
                  value={formData.working_dir || ''}
                  onChange={(e) =>
                    handleInputChange('working_dir', e.target.value)
                  }
                  placeholder="/app"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
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
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              {isEdit ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
