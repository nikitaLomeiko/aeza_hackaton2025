import { Node } from '@xyflow/react'
import { NodeProps } from '@xyflow/system'
import { NetworkConfig } from 'types/docker-compose.type'
import { NodeWrapper } from '../components/node.wrapper'

export type TypeNetworkConfig = Node<NetworkConfig, 'network'>

export const NetworkNode: React.FC<NodeProps<TypeNetworkConfig>> = ({
  data,
}) => {
  const renderDriverOptions = () => {
    console.log(data)
    if (!data.driver_opts || Object.keys(data.driver_opts).length === 0)
      return null

    const driverOpts = Object.entries(data.driver_opts)

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700">
            Driver Options
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
            {driverOpts.length}
          </span>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-1.5 bg-gray-50 rounded-lg p-2 border border-gray-200">
          {driverOpts.map(([key, value], index) => (
            <div key={key} className="group relative">
              <div className="flex items-start gap-2 p-1.5 rounded hover:bg-white transition-colors">
                <div className="w-1 h-1 bg-orange-300 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-gray-700 font-mono break-all">
                    {key} = {value}
                  </span>
                </div>
              </div>
              {index < driverOpts.length - 1 && (
                <div className="absolute bottom-0 left-3 right-2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
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
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700">Labels</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
            {labels.length}
          </span>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-1.5 bg-gray-50 rounded-lg p-2 border border-gray-200">
          {labels.map(([key, value], index) => (
            <div key={key} className="group relative">
              <div className="flex items-start gap-2 p-1.5 rounded hover:bg-white transition-colors">
                <div className="w-1 h-1 bg-purple-300 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-gray-700 font-mono break-all">
                    {key} = {value}
                  </span>
                </div>
              </div>
              {index < labels.length - 1 && (
                <div className="absolute bottom-0 left-3 right-2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
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
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700">
            IPAM Configuration
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
            {data.ipam.config.length}
          </span>
        </div>
        <div className="space-y-2">
          {data.ipam.config.map((config, index) => (
            <div
              key={index}
              className="bg-blue-50 rounded-lg p-3 border border-blue-100 space-y-1.5"
            >
              {config.subnet && (
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">
                    Subnet:
                  </span>
                  <span className="text-xs text-gray-800 font-mono">
                    {config.subnet}
                  </span>
                </div>
              )}
              {config.ip_range && (
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">
                    IP Range:
                  </span>
                  <span className="text-xs text-gray-800 font-mono">
                    {config.ip_range}
                  </span>
                </div>
              )}
              {config.gateway && (
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-600">
                    Gateway:
                  </span>
                  <span className="text-xs text-gray-800 font-mono">
                    {config.gateway}
                  </span>
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
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700">
            IPAM Options
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
            {ipamOptions.length}
          </span>
        </div>
        <div className="max-h-32 overflow-y-auto space-y-1.5 bg-gray-50 rounded-lg p-2 border border-gray-200">
          {ipamOptions.map(([key, value], index) => (
            <div key={key} className="group relative">
              <div className="flex items-start gap-2 p-1.5 rounded hover:bg-white transition-colors">
                <div className="w-1 h-1 bg-green-300 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-gray-700 font-mono break-all">
                    {key} = {value}
                  </span>
                </div>
              </div>
              {index < ipamOptions.length - 1 && (
                <div className="absolute bottom-0 left-3 right-2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
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
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-indigo-400 rounded-full flex-shrink-0"></div>
        <div className="flex flex-wrap gap-1.5">
          {flags.map((flag, index) => (
            <span
              key={index}
              className="px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full border border-indigo-200 font-medium"
            >
              {flag}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <NodeWrapper
      typeHandle="target"
      onDelete={() => console.log('Delete network')}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 min-w-72 max-w-96 backdrop-blur-sm bg-opacity-95">
        {/* Заголовок */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
          <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-sm"></div>
          <h3 className="font-semibold text-gray-900 truncate text-lg">
            Network: {data.name || 'Unnamed Network'}
          </h3>
        </div>

        {/* Основная информация */}
        <div className="space-y-4">
          {/* Driver */}
          {data.driver && (
            <div className="flex items-center gap-3 group">
              <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">
                  Driver
                </span>
                <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-200 font-medium capitalize">
                  {data.driver}
                </span>
              </div>
            </div>
          )}

          {/* IPAM Driver */}
          {data.ipam?.driver && (
            <div className="flex items-center gap-3 group">
              <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">
                  IPAM Driver
                </span>
                <span className="text-sm text-gray-800 font-mono bg-cyan-50 px-2 py-1 rounded border border-cyan-100">
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
      </div>
    </NodeWrapper>
  )
}
