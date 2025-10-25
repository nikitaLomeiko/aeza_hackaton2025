import React, { useState } from 'react'
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
      aux_addresses?: { key: string; value: string }[]
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

  const handleIpamConfigChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...ipamConfigs]
    updated[index] = { ...updated[index], [field]: value }
    setIpamConfigs(updated)

    handleInputChange('ipam', {
      ...formData.ipam,
      driver: formData.ipam?.driver || 'default',
      config: updated,
    })
  }

  const addIpamConfig = () => {
    setIpamConfigs((prev) => [...prev, {}])
  }

  const removeIpamConfig = (index: number) => {
    setIpamConfigs((prev) => prev.filter((_, i) => i !== index))
  }

  const handleIpamOptionsChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const updated = [...ipamOptions]
    updated[index][field] = value
    setIpamOptions(updated)

    const ipamOptionsObject = updated.reduce((acc, { key, value }) => {
      if (key) acc[key] = value
      return acc
    }, {} as Record<string, string>)

    handleInputChange('ipam', {
      ...formData.ipam,
      driver: formData.ipam?.driver || 'default',
      options: ipamOptionsObject,
      config: formData.ipam?.config || [],
    })
  }

  const addIpamOption = () => {
    setIpamOptions((prev) => [...prev, { key: '', value: '' }])
  }

  const removeIpamOption = (index: number) => {
    setIpamOptions((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Подготавливаем данные для отправки
    const submitData: Partial<NetworkConfig> = {
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
      ipam:
        formData.ipam &&
        (formData.ipam.driver ||
          formData.ipam.config?.length ||
          Object.keys(formData.ipam.options || {}).length)
          ? formData.ipam
          : undefined,
    }

    // Валидация через Valibot
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

    // ✅ Успешная валидация
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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md overflow-y-auto"
    >
      {/* Network Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Network Name
        </label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="my-network"
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
        <select
          value={formData.driver || 'bridge'}
          onChange={(e) => handleInputChange('driver', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.driver
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        >
          <option value="bridge">Bridge</option>
          <option value="overlay">Overlay</option>
          <option value="host">Host</option>
          <option value="macvlan">Macvlan</option>
          <option value="none">None</option>
        </select>
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
                placeholder="Option name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={opt.value}
                onChange={(e) =>
                  handleDriverOptsChange(index, 'value', e.target.value)
                }
                placeholder="Option value"
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
                placeholder="Label name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={label.value}
                onChange={(e) =>
                  handleLabelsChange(index, 'value', e.target.value)
                }
                placeholder="Label value"
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

      {/* IPAM Configuration */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          IPAM Configuration
        </label>

        {/* IPAM Driver */}
        <div className="mb-4">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* IPAM Configs */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IPAM Configs
          </label>
          <div className="space-y-4">
            {ipamConfigs.map((config, index) => (
              <div
                key={index}
                className="border p-4 rounded-md space-y-3 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Config {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeIpamConfig(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={config.subnet || ''}
                  onChange={(e) =>
                    handleIpamConfigChange(index, 'subnet', e.target.value)
                  }
                  placeholder="Subnet (e.g., 172.20.0.0/16)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={config.ip_range || ''}
                  onChange={(e) =>
                    handleIpamConfigChange(index, 'ip_range', e.target.value)
                  }
                  placeholder="IP Range (e.g., 172.20.10.0/24)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={config.gateway || ''}
                  onChange={(e) =>
                    handleIpamConfigChange(index, 'gateway', e.target.value)
                  }
                  placeholder="Gateway (e.g., 172.20.10.1)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addIpamConfig}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add IPAM Config
            </button>
          </div>
        </div>

        {/* IPAM Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IPAM Options
          </label>
          <div className="space-y-2">
            {ipamOptions.map((opt, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={opt.key}
                  onChange={(e) =>
                    handleIpamOptionsChange(index, 'key', e.target.value)
                  }
                  placeholder="Option name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={opt.value}
                  onChange={(e) =>
                    handleIpamOptionsChange(index, 'value', e.target.value)
                  }
                  placeholder="Option value"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeIpamOption(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addIpamOption}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add IPAM Option
            </button>
          </div>
        </div>
      </div>

      {/* Boolean Options */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.attachable || false}
            onChange={(e) => handleInputChange('attachable', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">Attachable</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.enable_ipv6 || false}
            onChange={(e) => handleInputChange('enable_ipv6', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Enable IPv6
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.internal || false}
            onChange={(e) => handleInputChange('internal', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">Internal</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.external || false}
            onChange={(e) => handleInputChange('external', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">External</label>
        </div>
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
          Save Network
        </button>
      </div>
    </form>
  )
}
