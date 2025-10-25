import { Node, NodeProps } from '@xyflow/react'
import React from 'react'
import type { VolumeConfig } from 'types/docker-compose.type'
import { NodeWrapper } from '../components/node.wrapper'
import { deleteNode } from 'store/project/project.store'
import { useUnit } from 'effector-react'

export type TypeVolumeConfig = Node<VolumeConfig, 'volume'>

export const VolumeInfo: React.FC<NodeProps<TypeVolumeConfig>> = ({
  data,
  id,
}) => {
  const deleteNodeFn = useUnit(deleteNode)

  const handleDelete = () => {
    deleteNodeFn(id)
  }

  // SVG иконки как React компоненты
  const DatabaseIcon = () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  )

  const SettingsIcon = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )

  const TagIcon = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )

  const ExternalLinkIcon = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )

  const FolderIcon = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )

  const HardDriveIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="22" y1="12" x2="2" y2="12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      <line x1="6" y1="16" x2="6.01" y2="16" />
      <line x1="10" y1="16" x2="10.01" y2="16" />
    </svg>
  )

  const FileTextIcon = () => (
    <svg
      className="w-5 h-5"
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

  const renderObjectAsList = (obj: Record<string, string> | undefined) => {
    if (!obj || Object.keys(obj).length === 0) {
      return (
        <div className="flex items-center text-gray-400">
          <span>None</span>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {Object.entries(obj).map(([key, value]) => (
          <div
            key={key}
            className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg"
          >
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {key}
              </div>
              <div className="text-sm text-gray-600 truncate">{value}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderExternalInfo = () => {
    if (data.external === undefined || data.external === false) {
      return (
        <div className="flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
          <FolderIcon />
          <span className="ml-2 font-medium">Internal Volume</span>
        </div>
      )
    }

    if (data.external === true) {
      return (
        <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
          <ExternalLinkIcon />
          <span className="ml-2 font-medium">External Volume</span>
        </div>
      )
    }

    if (typeof data.external === 'object' && data.external.name) {
      return (
        <div className="flex items-center text-purple-600 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
          <ExternalLinkIcon />
          <div className="ml-2">
            <div className="font-medium">External Volume</div>
            <div className="text-sm opacity-75">{data.external.name}</div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
        <ExternalLinkIcon />
        <span className="ml-2 font-medium">External Volume</span>
      </div>
    )
  }

  const getDriverColor = (driver: string | undefined) => {
    switch (driver) {
      case 'local':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'nfs':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'sshfs':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <NodeWrapper typeHandle="target" onDelete={handleDelete} nodeId={id}>
      <div className="space-y-6 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
            <DatabaseIcon />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">
              {data.name || 'Unnamed Volume'}
            </h3>
            <p className="text-sm text-gray-500 flex items-center">
              <HardDriveIcon />
              <span className="ml-1">Docker Volume</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                <FileTextIcon />
                <span className="ml-2">Basic Information</span>
              </h4>

              <div className="space-y-3">
                {/* Volume Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                    Volume Name
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    {data.name ? (
                      <span className="text-gray-900 font-semibold">
                        {data.name}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">
                        Not specified
                      </span>
                    )}
                  </div>
                </div>

                {/* Driver */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                    Driver
                  </label>
                  <div
                    className={`px-3 py-2 rounded-lg border ${getDriverColor(
                      data.driver
                    )}`}
                  >
                    {data.driver ? (
                      <span className="font-medium">{data.driver}</span>
                    ) : (
                      <span className="text-gray-600">Default (local)</span>
                    )}
                  </div>
                </div>

                {/* Volume Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                    Volume Type
                  </label>
                  {renderExternalInfo()}
                </div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-4">
            {/* Driver Options */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                <SettingsIcon />
                <span className="ml-2">Driver Options</span>
              </h4>
              {renderObjectAsList(data.driver_opts)}
            </div>

            {/* Labels */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                <TagIcon />
                <span className="ml-2">Labels</span>
              </h4>
              {renderObjectAsList(data.labels)}
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
          <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            <DatabaseIcon />
            <span className="ml-2">Volume Summary</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-lg font-bold text-blue-600">
                {data.driver ? data.driver : 'local'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Driver</div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-lg font-bold text-green-600">
                {data.external ? 'External' : 'Internal'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Type</div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-lg font-bold text-purple-600">
                {data.driver_opts ? Object.keys(data.driver_opts).length : 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">Driver Options</div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-lg font-bold text-orange-600">
                {data.labels ? Object.keys(data.labels).length : 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">Labels</div>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Volume Configured</span>
          </div>
          <div className="text-xs text-gray-400">ID: {id.slice(0, 8)}...</div>
        </div>
      </div>
    </NodeWrapper>
  )
}
