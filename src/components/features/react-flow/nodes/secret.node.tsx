import React from 'react'
import type { SecretConfig } from 'types/docker-compose.type'
import { NodeWrapper } from '../components/node.wrapper'
import { Node } from '@xyflow/react'
import { NodeProps } from '@xyflow/system'
import { useUnit } from 'effector-react'
import { deleteNode } from 'store/project/project.store'

export type TypeServiceConfig = Node<SecretConfig, 'service'>

export const SecretInfo: React.FC<NodeProps<TypeServiceConfig>> = ({
  data,
  id,
}) => {
  const deleteNodeFn = useUnit(deleteNode)

  const handleDelete = () => {
    deleteNodeFn(id)
  }

  // SVG иконки
  const LockIcon = () => (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )

  const FileIcon = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )

  const CodeIcon = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )

  const EnvironmentIcon = () => (
    <svg
      className="w-5 h-5"
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

  const ShieldIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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
            <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
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
          <LockIcon />
          <span className="ml-2 font-medium">Internal Secret</span>
        </div>
      )
    }

    if (data.external === true) {
      return (
        <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
          <ExternalLinkIcon />
          <span className="ml-2 font-medium">External Secret</span>
        </div>
      )
    }

    if (typeof data.external === 'object' && data.external.name) {
      return (
        <div className="flex items-center text-purple-600 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
          <ExternalLinkIcon />
          <div className="ml-2">
            <div className="font-medium">External Secret</div>
            <div className="text-sm opacity-75">{data.external.name}</div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
        <ExternalLinkIcon />
        <span className="ml-2 font-medium">External Secret</span>
      </div>
    )
  }

  const renderSecretSource = () => {
    if (data.file) {
      return (
        <div className="space-y-3">
          <div className="flex items-center text-blue-600">
            <FileIcon />
            <span className="ml-2 font-medium">File Source</span>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">File Path</div>
              <code className="text-sm text-gray-700 bg-white px-2 py-1 rounded border">
                {data.file}
              </code>
            </div>
          </div>
        </div>
      )
    }

    if (data.content) {
      return (
        <div className="space-y-3">
          <div className="flex items-center text-green-600">
            <CodeIcon />
            <span className="ml-2 font-medium">Direct Content</span>
          </div>
          <div className="p-3 bg-gray-900 rounded-lg border border-gray-700">
            <div className="text-sm text-green-400 font-mono whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
              {data.content}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {data.content.length} characters
          </div>
        </div>
      )
    }

    if (data.environment) {
      return (
        <div className="space-y-3">
          <div className="flex items-center text-purple-600">
            <EnvironmentIcon />
            <span className="ml-2 font-medium">Environment Variable</span>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                Variable Name
              </div>
              <code className="text-sm text-gray-700 bg-white px-2 py-1 rounded border">
                {data.environment}
              </code>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center py-8 text-gray-400">
        <LockIcon />
        <span className="ml-2">No source specified</span>
      </div>
    )
  }

  return (
    <NodeWrapper typeHandle="target" onDelete={handleDelete} nodeId={id}>
      <div className="space-y-6 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
          <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-sm">
            <LockIcon />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">
              {data.name || 'Unnamed Secret'}
            </h3>
            <p className="text-sm text-gray-500 flex items-center">
              <ShieldIcon />
              <span className="ml-1">Docker Secret</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                <LockIcon />
                <span className="ml-2">Basic Information</span>
              </h4>

              <div className="space-y-3">
                {/* Secret Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                    Secret Name
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

                {/* Secret Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                    Secret Type
                  </label>
                  {renderExternalInfo()}
                </div>
              </div>
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

          {/* Secret Source */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              <FileIcon />
              <span className="ml-2">Secret Source</span>
            </h4>
            <div className="min-h-[200px]">{renderSecretSource()}</div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5 border border-red-200">
          <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            <LockIcon />
            <span className="ml-2">Secret Summary</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-lg font-bold text-red-600">
                {data.name ? 'Named' : 'Unnamed'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Secret</div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div
                className={`text-lg font-bold ${
                  data.external ? 'text-orange-600' : 'text-green-600'
                }`}
              >
                {data.external ? 'External' : 'Internal'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Type</div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-lg font-bold text-blue-600">
                {data.file
                  ? 'File'
                  : data.content
                  ? 'Content'
                  : data.environment
                  ? 'Env'
                  : 'None'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Source</div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-lg font-bold text-purple-600">
                {data.labels ? Object.keys(data.labels).length : 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">Labels</div>
            </div>
          </div>
        </div>

        {/* Security Warning */}
        {data.content && (
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex-shrink-0 w-5 h-5 text-yellow-500 mt-0.5">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Security Notice
              </h3>
              <div className="mt-1 text-sm text-yellow-700">
                <p>
                  This secret contains sensitive data stored directly in the
                  configuration. Consider using file-based or external secrets
                  for production environments.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Secret Secured</span>
          </div>
          <div className="text-xs text-gray-400">ID: {id.slice(0, 8)}...</div>
        </div>
      </div>
    </NodeWrapper>
  )
}
