import { Node, NodeProps } from '@xyflow/react'
import React from 'react'
import type { VolumeConfig } from 'types/docker-compose.type'
import { NodeWrapper } from '../components/node.wrapper'

export type TypeVolumeConfig = Node<VolumeConfig, 'volume'>

export const VolumeInfo: React.FC<NodeProps<TypeVolumeConfig>> = ({ data }) => {
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

  return (
    <NodeWrapper typeHandle='target' onDelete={() => console.log('sdg')}>
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {data.name || 'Unnamed Volume'}
            </h3>
            <p className="text-sm text-gray-500">Volume Configuration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volume Name
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
              {data.name ? (
                <span className="text-gray-900 font-medium">{data.name}</span>
              ) : (
                <span className="text-gray-500">Not specified</span>
              )}
            </div>
          </div>

          {/* Driver */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Driver
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
              {data.driver ? (
                <span className="text-gray-900">{data.driver}</span>
              ) : (
                <span className="text-gray-500">Default (local)</span>
              )}
            </div>
          </div>

          {/* External */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volume Type
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
              {renderExternalInfo()}
            </div>
          </div>

          {/* Driver Options */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Driver Options
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 min-h-[60px]">
              {renderObjectAsList(data.driver_opts)}
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
            <p>
              •{' '}
              {data.driver
                ? `Uses ${data.driver} driver`
                : 'Uses default local driver'}
            </p>
            <p>
              •{' '}
              {data.external
                ? 'External volume'
                : 'Internal Docker Compose volume'}
            </p>
            <p>
              •{' '}
              {data.driver_opts && Object.keys(data.driver_opts).length > 0
                ? `${Object.keys(data.driver_opts).length} driver option(s)`
                : 'No driver options'}
            </p>
            <p>
              •{' '}
              {data.labels && Object.keys(data.labels).length > 0
                ? `${Object.keys(data.labels).length} label(s)`
                : 'No labels'}
            </p>
          </div>
        </div>
      </div>
    </NodeWrapper>
  )
};