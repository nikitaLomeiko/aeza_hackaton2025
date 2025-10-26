import React, { useState, useEffect } from 'react'
import {
  validateNetworkConfig,
  ValidatedNetworkConfig,
} from 'schemas/dockerNetwork.schema'
import type { NetworkConfig } from 'types/docker-compose.type'
import {
  addNewNode,
  changeNodeByCurrentProject,
} from 'store/project/project.store'
import { Node } from '@xyflow/react'

interface NetworkFormProps {
  initialData?: Partial<NetworkConfig>
  onCancel?: () => void
  isEdit?: boolean
  currentNode?: Node
}

export const NetworkForm: React.FC<NetworkFormProps> = ({
  initialData = {},
  onCancel,
  currentNode,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<Partial<NetworkConfig>>({
    driver: 'bridge',
    attachable: false,
    enable_ipv6: false,
    internal: false,
    external: false,
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

  const [ipamConfigs, setIpamConfigs] = useState<
    Array<{
      subnet?: string
      ip_range?: string
      gateway?: string
    }>
  >((formData.ipam?.config as any) || [{}])

  const [ipamOptions, setIpamOptions] = useState<
    { key: string; value: string }[]
  >(
    Object.entries(formData.ipam?.options || {}).map(([key, value]) => ({
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

  // Синхронизация ipamConfigs с formData.ipam.config
  useEffect(() => {
    const validConfigs = ipamConfigs.filter(
      (config) => config.subnet || config.ip_range || config.gateway
    )
    handleInputChange('ipam', {
      ...formData.ipam,
      driver: formData.ipam?.driver || 'default',
      config: validConfigs.length > 0 ? validConfigs : undefined,
    })
  }, [ipamConfigs])

  // Синхронизация ipamOptions с formData.ipam.options
  useEffect(() => {
    const ipamOptionsObject = ipamOptions.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key] = value
      return acc
    }, {} as Record<string, string>)

    handleInputChange('ipam', {
      ...formData.ipam,
      driver: formData.ipam?.driver || 'default',
      options:
        Object.keys(ipamOptionsObject).length > 0
          ? ipamOptionsObject
          : undefined,
    })
  }, [ipamOptions])

  const handleInputChange = (field: keyof NetworkConfig, value: any) => {
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

  const handleIpamConfigChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...ipamConfigs]
    updated[index] = { ...updated[index], [field]: value }
    setIpamConfigs(updated)
  }

  const addIpamConfig = () => {
    setIpamConfigs((prev) => [...prev, {}])
  }

  const removeIpamConfig = (index: number) => {
    const updated = ipamConfigs.filter((_, i) => i !== index)
    setIpamConfigs(updated)
  }

  const handleIpamOptionsChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const updated = [...ipamOptions]
    updated[index][field] = value
    setIpamOptions(updated)
  }

  const addIpamOption = () => {
    setIpamOptions((prev) => [...prev, { key: '', value: '' }])
  }

  const removeIpamOption = (index: number) => {
    const updated = ipamOptions.filter((_, i) => i !== index)
    setIpamOptions(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData: Partial<NetworkConfig> = {
      ...formData,
      driver_opts:
        Object.keys(formData.driver_opts || {}).length > 0
          ? formData.driver_opts
          : undefined,
      labels:
        Object.keys(formData.labels || {}).length > 0
          ? formData.labels
          : undefined,
      ipam:
        formData.ipam &&
        (formData.ipam.driver ||
          formData.ipam.config?.length ||
          Object.keys(formData.ipam.options || {}).length)
          ? formData.ipam
          : undefined,
    }

    const result = validateNetworkConfig(submitData)

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

    const validData = result.output as ValidatedNetworkConfig

    if (!isEdit)
      addNewNode({
        id: String(Date.now()),
        position: { x: 0, y: 0 },
        type: 'network',
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
    { id: 'driver', name: 'Driver', icon: '🔧' },
    { id: 'labels', name: 'Labels', icon: '🏷️' },
    { id: 'ipam', name: 'IPAM', icon: '🌐' },
    { id: 'options', name: 'Options', icon: '⚡' },
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
              <span className="text-white text-sm">🌐</span>
            </div>
            {isEdit ? 'Edit Network' : 'New Network'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure your Docker network
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
                  Essential network settings
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Network Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="my-network"
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
                  <select
                    value={formData.driver || 'bridge'}
                    onChange={(e) =>
                      handleInputChange('driver', e.target.value)
                    }
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.driver
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  >
                    <option value="bridge">Bridge</option>
                    <option value="overlay">Overlay</option>
                    <option value="host">Host</option>
                    <option value="macvlan">Macvlan</option>
                    <option value="none">None</option>
                  </select>
                  {errors.driver && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <span>⚠️</span> {errors.driver}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Driver Section */}
          {activeSection === 'driver' && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Driver Options
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Configure network driver options
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
                        placeholder="Option name"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <input
                        type="text"
                        value={opt.value}
                        onChange={(e) =>
                          handleDriverOptsChange(index, 'value', e.target.value)
                        }
                        placeholder="Option value"
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
                  Add metadata labels to the network
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Network Labels
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
                        placeholder="Label name"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <input
                        type="text"
                        value={label.value}
                        onChange={(e) =>
                          handleLabelsChange(index, 'value', e.target.value)
                        }
                        placeholder="Label value"
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

          {/* IPAM Section */}
          {activeSection === 'ipam' && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  IPAM Configuration
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Configure IP Address Management
                </p>
              </div>

              <div className="space-y-6">
                {/* IPAM Driver */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IPAM Driver
                  </label>
                  <input
                    type="text"
                    value={formData.ipam?.driver || ''}
                    onChange={(e) =>
                      handleInputChange('ipam', {
                        ...formData.ipam,
                        driver: e.target.value,
                      })
                    }
                    placeholder="default"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* IPAM Configs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    IPAM Configurations
                  </label>
                  <div className="space-y-4">
                    {ipamConfigs.map((config, index) => (
                      <div
                        key={index}
                        className="border-2 border-gray-200 p-4 rounded-xl space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-gray-900">
                            Config {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeIpamConfig(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                          >
                            <span>🗑️</span> Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          <input
                            type="text"
                            value={config.subnet || ''}
                            onChange={(e) =>
                              handleIpamConfigChange(
                                index,
                                'subnet',
                                e.target.value
                              )
                            }
                            placeholder="Subnet (e.g., 172.20.0.0/16)"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <input
                            type="text"
                            value={config.ip_range || ''}
                            onChange={(e) =>
                              handleIpamConfigChange(
                                index,
                                'ip_range',
                                e.target.value
                              )
                            }
                            placeholder="IP Range (e.g., 172.20.10.0/24)"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                          <input
                            type="text"
                            value={config.gateway || ''}
                            onChange={(e) =>
                              handleIpamConfigChange(
                                index,
                                'gateway',
                                e.target.value
                              )
                            }
                            placeholder="Gateway (e.g., 172.20.10.1)"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addIpamConfig}
                      className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
                    >
                      <span>➕</span> Add IPAM Config
                    </button>
                  </div>
                </div>

                {/* IPAM Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    IPAM Options
                  </label>
                  <div className="space-y-3">
                    {ipamOptions.map((opt, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={opt.key}
                          onChange={(e) =>
                            handleIpamOptionsChange(
                              index,
                              'key',
                              e.target.value
                            )
                          }
                          placeholder="Option name"
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        <input
                          type="text"
                          value={opt.value}
                          onChange={(e) =>
                            handleIpamOptionsChange(
                              index,
                              'value',
                              e.target.value
                            )
                          }
                          placeholder="Option value"
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => removeIpamOption(index)}
                          className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                        >
                          <span>🗑️</span>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addIpamOption}
                      className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
                    >
                      <span>➕</span> Add IPAM Option
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Options Section */}
          {activeSection === 'options' && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Network Options
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Configure additional network settings
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.attachable || false}
                    onChange={(e) =>
                      handleInputChange('attachable', e.target.checked)
                    }
                    className="mr-3 w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Attachable</div>
                    <div className="text-sm text-gray-500">
                      Allow standalone containers to attach to this network
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enable_ipv6 || false}
                    onChange={(e) =>
                      handleInputChange('enable_ipv6', e.target.checked)
                    }
                    className="mr-3 w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Enable IPv6</div>
                    <div className="text-sm text-gray-500">
                      Enable IPv6 networking on this network
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.internal || false}
                    onChange={(e) =>
                      handleInputChange('internal', e.target.checked)
                    }
                    className="mr-3 w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Internal</div>
                    <div className="text-sm text-gray-500">
                      Restrict external access to the network
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.external || false}
                    onChange={(e) =>
                      handleInputChange('external', e.target.checked)
                    }
                    className="mr-3 w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">External</div>
                    <div className="text-sm text-gray-500">
                      Use an externally created network
                    </div>
                  </div>
                </label>
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
              {isEdit ? 'Update Network' : 'Create Network'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
