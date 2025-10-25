import { Node } from '@xyflow/react'
import { NodeProps } from '@xyflow/system'
import { ServiceConfig } from 'types/docker-compose.type'
import { NodeWrapper } from '../components/node.wrapper'
import { useUnit } from 'effector-react'
import { deleteNode } from 'store/project/project.store'

export type TypeServiceConfig = Node<ServiceConfig, 'service'>

export const CustomNode: React.FC<NodeProps<TypeServiceConfig>> = ({
  data,
  id,
}) => {
  const deleteNodeFn = useUnit(deleteNode)

  const handleDelete = () => {
    deleteNodeFn(id)
  }

  // SVG иконки
  const ContainerIcon = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 7h20M2 17h20M5 12h14M8 2v4m8-4v4" />
      <rect x="2" y="2" width="20" height="20" rx="2" />
    </svg>
  )

  const ImageIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )

  const CommandIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  )

  const PortIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  )

  const VolumeIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )

  const EnvironmentIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )

  const RestartIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
      <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
    </svg>
  )

  const UserIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )

  const FolderIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )

  const renderEnvironment = () => {
    if (!data.environment) return null

    const envVars = Array.isArray(data.environment)
      ? data.environment
      : Object.entries(data.environment).map(
          ([key, value]) => `${key}=${value}`
        )

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <EnvironmentIcon />
          <span className="text-sm font-semibold text-gray-700">
            Environment Variables
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {envVars.length}
          </span>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-2 bg-purple-50 rounded-lg p-3 border border-purple-200">
          {envVars.map((env, index) => (
            <div key={index} className="group">
              <div className="flex items-start gap-2 p-2 rounded hover:bg-white transition-colors">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <span className="text-xs text-gray-700 font-mono break-all leading-relaxed">
                  {env}
                </span>
              </div>
              {index < envVars.length - 1 && (
                <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderVolumes = () => {
    if (
      !data.volumes ||
      !Array.isArray(data.volumes) ||
      data.volumes.length === 0
    ) {
      return null
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <VolumeIcon />
          <span className="text-sm font-semibold text-gray-700">Volumes</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {data.volumes.length}
          </span>
        </div>
        <div className="space-y-3 bg-amber-50 rounded-lg p-4 border border-amber-200">
          {data.volumes.map((volume, index) => {
            let source = ''
            let target = ''
            let mode = ''

            if (typeof volume === 'string') {
              const parts = volume.split(':')
              source = parts[0] || ''
              target = parts[1] || ''
              mode = parts[2] || ''
            }

            return (
              <div key={index} className="group">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-amber-100 hover:border-amber-300 transition-all duration-200 hover:shadow-sm">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center shadow-sm">
                      <FolderIcon />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded border border-amber-200 font-mono break-all">
                        {source}
                      </span>
                      <svg
                        className="w-3 h-3 text-amber-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                      <span className="text-xs font-medium text-amber-800 bg-white px-2 py-1 rounded border border-amber-300 font-mono break-all">
                        {target}
                      </span>
                    </div>

                    {mode && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-600 font-medium">
                          Mode:
                        </span>
                        <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 font-mono">
                          {mode}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">
                        Type:
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          source.startsWith('/') || source.startsWith('./')
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-green-100 text-green-700 border border-green-200'
                        }`}
                      >
                        {source.startsWith('/') || source.startsWith('./')
                          ? 'Bind Mount'
                          : 'Named Volume'}
                      </span>
                    </div>
                  </div>
                </div>

                {index < (data.volumes || []).length - 1 && (
                  <div className="my-2 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <NodeWrapper typeHandle="source" onDelete={handleDelete} nodeId={id}>
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-6 min-w-80 max-w-md backdrop-blur-sm">
        {/* Заголовок */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
            <ContainerIcon />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate text-lg">
              {data.container_name || 'Unnamed Service'}
            </h3>
            <p className="text-sm text-gray-500">Docker Service</p>
          </div>
        </div>

        {/* Основная информация */}
        <div className="space-y-4">
          {/* Image */}
          {data.image && (
            <div className="flex items-start gap-3 group p-3 bg-blue-50 rounded-lg border border-blue-100">
              <ImageIcon />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-gray-600 block mb-1">
                  Image
                </span>
                <span className="text-sm text-gray-800 font-mono break-all">
                  {data.image}
                </span>
              </div>
            </div>
          )}

          {/* Command */}
          {data.command && (
            <div className="flex items-start gap-3 group p-3 bg-green-50 rounded-lg border border-green-100">
              <CommandIcon />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-gray-600 block mb-1">
                  Command
                </span>
                <span className="text-sm text-gray-800 font-mono break-all">
                  {typeof data.command === 'string'
                    ? data.command
                    : data.command.join(' ')}
                </span>
              </div>
            </div>
          )}

          {/* Ports */}
          {data.ports && data.ports.length > 0 && (
            <div className="flex items-start gap-3 group p-3 bg-orange-50 rounded-lg border border-orange-100">
              <PortIcon />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-gray-600 block mb-2">
                  Ports
                </span>
                <div className="flex flex-wrap gap-2">
                  {data.ports.map((port, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-orange-100 text-orange-800 text-sm rounded-lg border border-orange-200 font-medium shadow-sm"
                    >
                      {port}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Volumes */}
          {renderVolumes()}

          {/* Environment */}
          {renderEnvironment()}

          {/* Restart policy */}
          {data.restart && data.restart !== 'no' && (
            <div className="flex items-center gap-3 group p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <RestartIcon />
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-600">
                  Restart Policy
                </span>
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-sm rounded-full border border-emerald-200 font-medium capitalize shadow-sm">
                  {data.restart}
                </span>
              </div>
            </div>
          )}

          {/* User */}
          {data.user && (
            <div className="flex items-center gap-3 group p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <UserIcon />
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-600">
                  User
                </span>
                <span className="text-sm text-gray-800 font-mono bg-white px-3 py-1.5 rounded border border-indigo-200 shadow-sm">
                  {data.user}
                </span>
              </div>
            </div>
          )}

          {/* Working dir */}
          {data.working_dir && (
            <div className="flex items-start gap-3 group p-3 bg-cyan-50 rounded-lg border border-cyan-100">
              <FolderIcon />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-gray-600 block mb-1">
                  Working Directory
                </span>
                <span className="text-sm text-gray-800 font-mono break-all">
                  {data.working_dir}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Service Ready</span>
          </div>
          <div className="text-xs text-gray-400">ID: {id.slice(0, 8)}...</div>
        </div>
      </div>
    </NodeWrapper>
  )
}
