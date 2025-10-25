import { Node } from '@xyflow/react'
import { NodeProps } from '@xyflow/system'
import { ServiceConfig } from 'types/docker-compose.type'
import { NodeWrapper } from '../components/node.wrapper'

export type TypeServiceConfig = Node<ServiceConfig, 'service'>

export const CustomNode: React.FC<NodeProps<TypeServiceConfig>> = ({
  data,
}) => {
  const renderEnvironment = () => {
    if (!data.environment) return null

    const envVars = Array.isArray(data.environment)
      ? data.environment
      : Object.entries(data.environment).map(
          ([key, value]) => `${key}=${value}`
        )

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700">
            Environment Variables
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
            {envVars.length}
          </span>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-1.5 bg-gray-50 rounded-lg p-2 border border-gray-200">
          {envVars.map((env, index) => (
            <div key={index} className="group relative">
              <div className="flex items-start gap-2 p-1.5 rounded hover:bg-white transition-colors">
                <div className="w-1 h-1 bg-purple-300 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-xs text-gray-700 font-mono break-all leading-relaxed">
                  {env}
                </span>
              </div>
              {index < envVars.length - 1 && (
                <div className="absolute bottom-0 left-3 right-2 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <NodeWrapper typeHandle="source" onDelete={() => console.log('sdg')}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 min-w-72 max-w-96 backdrop-blur-sm bg-opacity-95">
        {/* Заголовок */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
          <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
          <h3 className="font-semibold text-gray-900 truncate text-lg">
            Service: {data.container_name || 'Unnamed Service'}
          </h3>
        </div>

        {/* Основная информация */}
        <div className="space-y-4">
          {/* Image */}
          {data.image && (
            <div className="flex items-start gap-3 group">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-gray-600 block mb-1">
                  Image
                </span>
                <span className="text-sm text-gray-800 font-mono break-all bg-blue-50 px-2 py-1 rounded border border-blue-100">
                  {data.image}
                </span>
              </div>
            </div>
          )}

          {/* Command */}
          {data.command && (
            <div className="flex items-start gap-3 group">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-gray-600 block mb-1">
                  Command
                </span>
                <span className="text-sm text-gray-800 font-mono break-all bg-green-50 px-2 py-1 rounded border border-green-100">
                  {typeof data.command === 'string'
                    ? data.command
                    : data.command.join(' ')}
                </span>
              </div>
            </div>
          )}

          {/* Ports */}
          {data.ports && data.ports.length > 0 && (
            <div className="flex items-start gap-3 group">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-gray-600 block mb-1">
                  Ports
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {data.ports.map((port, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-lg border border-orange-200 font-medium"
                    >
                      {port}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Environment */}
          {renderEnvironment()}

          {/* Restart policy */}
          {data.restart && data.restart !== 'no' && (
            <div className="flex items-center gap-3 group">
              <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">
                  Restart Policy
                </span>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full border border-emerald-200 font-medium capitalize">
                  {data.restart}
                </span>
              </div>
            </div>
          )}

          {/* User */}
          {data.user && (
            <div className="flex items-center gap-3 group">
              <div className="w-2 h-2 bg-indigo-400 rounded-full flex-shrink-0"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">User</span>
                <span className="text-sm text-gray-800 font-mono bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                  {data.user}
                </span>
              </div>
            </div>
          )}

          {/* Working dir */}
          {data.working_dir && (
            <div className="flex items-start gap-3 group">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-gray-600 block mb-1">
                  Working Directory
                </span>
                <span className="text-sm text-gray-800 font-mono break-all bg-cyan-50 px-2 py-1 rounded border border-cyan-100">
                  {data.working_dir}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </NodeWrapper>
  )
}
