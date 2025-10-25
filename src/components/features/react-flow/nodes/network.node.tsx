import { Node } from '@xyflow/react'
import { NodeProps } from '@xyflow/system'
import { NetworkConfig } from 'types/docker-compose.type'
import { NodeWrapper } from '../components/node.wrapper'
import { useUnit } from 'effector-react'
import { $project, deleteNode } from 'store/project/project.store'
import { NetworkForm } from 'components/forms/network-form'
import { useState } from 'react'

export type TypeNetworkConfig = Node<NetworkConfig, 'network'>

export const NetworkNode: React.FC<NodeProps<TypeNetworkConfig>> = ({
  data,
  id,
}) => {
  const deleteNodeFn = useUnit(deleteNode)

  const projectState = useUnit($project)

  const [viewForm, setView] = useState(false)

  const currentProject = projectState.projects.find(
    (item) => item.id === projectState.currentId
  )

  const currentNode = (currentProject?.nodes || []).find(
    (item) => item.id === id
  )

  const handleDelete = () => {
    deleteNodeFn(id)
  }

  // SVG иконки
  const NetworkIcon = () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="18" x2="16" y2="18" />
      <line x1="12" y1="6" x2="12" y2="10" />
      <line x1="12" y1="14" x2="12" y2="18" />
    </svg>
  )

  const SettingsIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )

  const TagIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )

  const IpIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )

  const FlagIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  )

  const renderDriverOptions = () => {
    if (!data.driver_opts || Object.keys(data.driver_opts).length === 0)
      return null

    const driverOpts = Object.entries(data.driver_opts)

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <SettingsIcon />
          <span className="text-sm font-semibold text-gray-700">
            Driver Options
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {driverOpts.length}
          </span>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-2 bg-orange-50 rounded-lg p-3 border border-orange-200">
          {driverOpts.map(([key, value], index) => (
            <div key={key} className="group">
              <div className="flex items-start gap-2 p-2 rounded hover:bg-white transition-colors">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-gray-700 font-mono break-all">
                    {key} = {value}
                  </span>
                </div>
              </div>
              {index < driverOpts.length - 1 && (
                <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderLabels = () => {
    if (!data.labels || Object.keys(data.labels).length === 0) return null

    const labels = Object.entries(data.labels)

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TagIcon />
          <span className="text-sm font-semibold text-gray-700">Labels</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {labels.length}
          </span>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-2 bg-purple-50 rounded-lg p-3 border border-purple-200">
          {labels.map(([key, value], index) => (
            <div key={key} className="group">
              <div className="flex items-start gap-2 p-2 rounded hover:bg-white transition-colors">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-gray-700 font-mono break-all">
                    {key} = {value}
                  </span>
                </div>
              </div>
              {index < labels.length - 1 && (
                <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderIPAMConfig = () => {
    if (!data.ipam?.config || data.ipam.config.length === 0) return null

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <IpIcon />
          <span className="text-sm font-semibold text-gray-700">
            IPAM Configuration
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {data.ipam.config.length}
          </span>
        </div>
        <div className="space-y-3">
          {data.ipam.config.map((config, index) => (
            <div
              key={index}
              className="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-2"
            >
              {config.subnet && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600">
                      Subnet:
                    </span>
                    <span className="text-xs text-gray-800 font-mono bg-white px-2 py-1 rounded border border-blue-300">
                      {config.subnet}
                    </span>
                  </div>
                </div>
              )}
              {config.ip_range && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600">
                      IP Range:
                    </span>
                    <span className="text-xs text-gray-800 font-mono bg-white px-2 py-1 rounded border border-blue-300">
                      {config.ip_range}
                    </span>
                  </div>
                </div>
              )}
              {config.gateway && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600">
                      Gateway:
                    </span>
                    <span className="text-xs text-gray-800 font-mono bg-white px-2 py-1 rounded border border-blue-300">
                      {config.gateway}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderIPAMOptions = () => {
    if (!data.ipam?.options || Object.keys(data.ipam.options).length === 0)
      return null

    const ipamOptions = Object.entries(data.ipam.options)

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <SettingsIcon />
          <span className="text-sm font-semibold text-gray-700">
            IPAM Options
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {ipamOptions.length}
          </span>
        </div>
        <div className="max-h-32 overflow-y-auto space-y-2 bg-green-50 rounded-lg p-3 border border-green-200">
          {ipamOptions.map(([key, value], index) => (
            <div key={key} className="group">
              <div className="flex items-start gap-2 p-2 rounded hover:bg-white transition-colors">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-gray-700 font-mono break-all">
                    {key} = {value}
                  </span>
                </div>
              </div>
              {index < ipamOptions.length - 1 && (
                <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderBooleanFlags = () => {
    const flags = []

    if (data.attachable) flags.push('Attachable')
    if (data.enable_ipv6) flags.push('IPv6 Enabled')
    if (data.internal) flags.push('Internal')
    if (data.external) flags.push('External')

    if (flags.length === 0) return null

    return (
      <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
        <FlagIcon />
        <div className="flex-1">
          <span className="text-sm font-semibold text-gray-700 block mb-2">
            Network Flags
          </span>
          <div className="flex flex-wrap gap-2">
            {flags.map((flag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-indigo-100 text-indigo-800 text-sm rounded-lg border border-indigo-200 font-medium shadow-sm"
              >
                {flag}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <NodeWrapper
      showForm={() => setView(true)}
      viewForm={viewForm}
      form={
        <NetworkForm
          isEdit
          currentNode={currentNode}
          initialData={data}
          onCancel={() => setView(false)}
        />
      }
      typeHandle="target"
      onDelete={handleDelete}
      nodeId={id}
    >
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-6 min-w-80 max-w-md backdrop-blur-sm">
        {/* Заголовок */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm">
            <NetworkIcon />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate text-lg">
              {data.name || 'Unnamed Network'}
            </h3>
            <p className="text-sm text-gray-500">Docker Network</p>
          </div>
        </div>

        {/* Основная информация */}
        <div className="space-y-4">
          {/* Driver */}
          {data.driver && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <SettingsIcon />
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600">
                  Driver
                </span>
                <span className="px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-full border border-green-200 font-medium capitalize shadow-sm">
                  {data.driver}
                </span>
              </div>
            </div>
          )}

          {/* IPAM Driver */}
          {data.ipam?.driver && (
            <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg border border-cyan-100">
              <IpIcon />
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600">
                  IPAM Driver
                </span>
                <span className="text-sm text-gray-800 font-mono bg-white px-3 py-1.5 rounded border border-cyan-200 shadow-sm">
                  {data.ipam.driver}
                </span>
              </div>
            </div>
          )}

          {/* Driver Options */}
          {renderDriverOptions()}

          {/* Labels */}
          {renderLabels()}

          {/* IPAM Configuration */}
          {renderIPAMConfig()}

          {/* IPAM Options */}
          {renderIPAMOptions()}

          {/* Boolean Flags */}
          {renderBooleanFlags()}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Network Ready</span>
          </div>
          <div className="text-xs text-gray-400">ID: {id.slice(0, 8)}...</div>
        </div>
      </div>
    </NodeWrapper>
  )
}
