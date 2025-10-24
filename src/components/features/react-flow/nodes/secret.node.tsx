import React from 'react'
import type { SecretConfig } from 'types/docker-compose.type'
import { NodeWrapper } from '../components/node.wrapper'
import { Node } from '@xyflow/react';
import { NodeProps } from '@xyflow/system';

export type TypeServiceConfig = Node<SecretConfig, "service">;


export const SecretInfo: React.FC<NodeProps<TypeServiceConfig>> = ({ data }) => {
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

  const renderSecretSource = () => {
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
          <div className="mt-2 p-2 bg-gray-50 rounded border text-sm font-mono whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
            {data.content}
          </div>
        </div>
      )
    }

    if (data.environment) {
      return (
        <div>
          <span className="text-gray-600">Source: </span>
          <span className="font-medium">Environment Variable</span>
          <div className="mt-1 text-sm">
            <span className="text-gray-500">Variable: </span>
            <code className="bg-gray-100 px-1 rounded">{data.environment}</code>
          </div>
        </div>
      )
    }

    return <span className="text-gray-500">Not specified</span>
  }

  return (
    <NodeWrapper onDelete={() => console.log('sdg')}>
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {data.name || 'Unnamed Secret'}
            </h3>
            <p className="text-sm text-gray-500">Secret Configuration</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secret Name
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
              Secret Type
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
              {renderExternalInfo()}
            </div>
          </div>

          {/* Secret Source */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secret Source
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 min-h-[80px]">
              {renderSecretSource()}
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
            <p>• {data.name ? `Name: ${data.name}` : 'Unnamed secret'}</p>
            <p>
              •{' '}
              {data.external
                ? 'External secret'
                : 'Internal Docker Compose secret'}
            </p>
            <p>
              • {data.file && 'Source: File'}
              {data.content && 'Source: Direct content'}
              {data.environment && 'Source: Environment variable'}
              {!data.file &&
                !data.content &&
                !data.environment &&
                'Source: Not specified'}
            </p>
            <p>
              •{' '}
              {data.labels && Object.keys(data.labels).length > 0
                ? `${Object.keys(data.labels).length} label(s)`
                : 'No labels'}
            </p>
          </div>
        </div>

        {/* Security Note */}
        {data.content && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Security Notice
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    This secret contains sensitive data stored directly in the
                    configuration. Consider using file-based or external secrets
                    for production environments.
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
