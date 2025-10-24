import React from 'react'
import type { ConfigConfig } from 'types/docker-compose.type'
import { NodeWrapper } from '../components/node.wrapper'
import { Node, NodeProps } from '@xyflow/react'

export type TypeConfigkConfig = Node<ConfigConfig, 'config'>

export const ConfigInfo: React.FC<NodeProps<TypeConfigkConfig>> = ({ data }) => {
  const renderObjectAsList = (obj: Record<string, string> | undefined) => {
    if (!obj || Object.keys(obj).length === 0) {
      return <span className="text-gray-500">None</span>
    }

    return (
      <ul className="space-y-1">
        {Object.entries(obj).map(([key, value]) => (
          <li key={key} className="text-sm">
            <span className="font-medium">{key}:</span> {value}
          </li>
        ))}
      </ul>
    )
  }

  const renderExternalInfo = () => {
    if (data.external === undefined || data.external === false) {
      return <span className="text-gray-600">Internal</span>
    }

    if (data.external === true) {
      return <span className="text-gray-600">External</span>
    }

    if (typeof data.external === 'object' && data.external.name) {
      return (
        <div>
          <span className="text-gray-600">External: </span>
          <span className="font-medium">{data.external.name}</span>
        </div>
      )
    }

    return <span className="text-gray-600">External</span>
  }

  const renderConfigSource = () => {
    if (data.file) {
      return (
        <div>
          <span className="text-gray-600">Source: </span>
          <span className="font-medium">File</span>
          <div className="mt-1 text-sm">
            <span className="text-gray-500">Path: </span>
            <code className="bg-gray-100 px-1 rounded">{data.file}</code>
          </div>
        </div>
      )
    }

    if (data.content) {
      return (
        <div>
          <span className="text-gray-600">Source: </span>
          <span className="font-medium">Direct Content</span>
          <div className="mt-2 p-2 bg-gray-50 rounded border text-sm font-mono whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
            {data.content}
          </div>
        </div>
      )
    }

    return <span className="text-gray-500">Not specified</span>
  }

  return (
    <NodeWrapper onDelete={() => console.log('Delete network')}>
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {data.name || 'Unnamed Config'}
            </h3>
            <p className="text-sm text-gray-500">Config Configuration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Config Name
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
              {data.name ? (
                <span className="text-gray-900 font-medium">{data.name}</span>
              ) : (
                <span className="text-gray-500">Not specified</span>
              )}
            </div>
          </div>

          {/* External */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Config Type
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
              {renderExternalInfo()}
            </div>
          </div>

          {/* Config Source */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Config Source
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 min-h-[100px]">
              {renderConfigSource()}
            </div>
          </div>

          {/* Labels */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Labels
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 min-h-[60px]">
              {renderObjectAsList(data.labels)}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• {data.name ? `Name: ${data.name}` : 'Unnamed config'}</p>
            <p>
              •{' '}
              {data.external
                ? 'External config'
                : 'Internal Docker Compose config'}
            </p>
            <p>
              • {data.file && 'Source: File'}
              {data.content && 'Source: Direct content'}
              {!data.file && !data.content && 'Source: Not specified'}
            </p>
            <p>
              •{' '}
              {data.labels && Object.keys(data.labels).length > 0
                ? `${Object.keys(data.labels).length} label(s)`
                : 'No labels'}
            </p>
          </div>
        </div>

        {/* Content Size Info */}
        {data.content && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Content Information
                </h3>
                <div className="mt-1 text-sm text-blue-700">
                  <p>
                    Config contains {data.content.length} characters
                    {data.content.length > 1024 &&
                      ' - consider using file-based config for large content'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </NodeWrapper>
  )
}
