import React, { useState } from 'react'
import type { ConfigConfig } from 'types/docker-compose.type'
import { NodeWrapper } from '../components/node.wrapper'
import { Node, NodeProps } from '@xyflow/react'
import { useUnit } from 'effector-react'
import { $project, deleteNode } from 'store/project/project.store'
import { ConfigForm } from 'components/forms/config-form'

export type TypeConfigkConfig = Node<ConfigConfig, 'config'>

export const ConfigInfo: React.FC<NodeProps<TypeConfigkConfig>> = ({
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
  const FileIcon = () => (
    <svg
      className="w-6 h-6"
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

  const CodeIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
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
            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
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
          <FileIcon />
          <span className="ml-2 font-medium">Internal Config</span>
        </div>
      )
    }

    if (data.external === true) {
      return (
        <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
          <ExternalLinkIcon />
          <span className="ml-2 font-medium">External Config</span>
        </div>
      )
    }

    if (typeof data.external === 'object' && data.external.name) {
      return (
        <div className="flex items-center text-purple-600 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
          <ExternalLinkIcon />
          <div className="ml-2">
            <div className="font-medium">External Config</div>
            <div className="text-sm opacity-75">{data.external.name}</div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
        <ExternalLinkIcon />
        <span className="ml-2 font-medium">External Config</span>
      </div>
    )
  }

  const renderConfigSource = () => {
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
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
              {data.content}
            </pre>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{data.content.length} characters</span>
            {data.content.length > 1024 && (
              <span className="text-orange-500">
                Consider using file for large content
              </span>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center py-8 text-gray-400">
        <FileIcon />
        <span className="ml-2">No source specified</span>
      </div>
    )
  }

  return (
    <NodeWrapper
      showForm={() => setView(true)}
      viewForm={viewForm}
      form={
        <ConfigForm
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
      <div className="space-y-6 bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm">
            <FileIcon />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">
              {data.name || 'Unnamed Config'}
            </h3>
            <p className="text-sm text-gray-500">Docker Config</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                <SettingsIcon />
                <span className="ml-2">Basic Information</span>
              </h4>

              <div className="space-y-3">
                {/* Config Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                    Config Name
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

                {/* Config Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                    Config Type
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

          {/* Config Source */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              <FileIcon />
              <span className="ml-2">Config Source</span>
            </h4>
            <div className="min-h-[200px]">{renderConfigSource()}</div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-200">
          <h4 className="flex items-center text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            <FileIcon />
            <span className="ml-2">Config Summary</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-lg font-bold text-purple-600">
                {data.name ? 'Named' : 'Unnamed'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Config</div>
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
                {data.file ? 'File' : data.content ? 'Content' : 'None'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Source</div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-lg font-bold text-indigo-600">
                {data.labels ? Object.keys(data.labels).length : 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">Labels</div>
            </div>
          </div>
        </div>

        {/* Content Warning */}
        {data.content && data.content.length > 1024 && (
          <div className="flex items-start space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex-shrink-0 w-5 h-5 text-orange-500 mt-0.5">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-orange-800">
                Large Content Detected
              </h3>
              <div className="mt-1 text-sm text-orange-700">
                <p>
                  Config contains {data.content.length} characters. For better
                  performance, consider using a file-based configuration.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Config Ready</span>
          </div>
          <div className="text-xs text-gray-400">ID: {id.slice(0, 8)}...</div>
        </div>
      </div>
    </NodeWrapper>
  )
}
