import { Handle, Position } from '@xyflow/react'
import { ReactNode, useState } from 'react'

interface NodeWrapperProps {
  children: ReactNode
  onDelete: () => void
  typeHandle: 'source' | 'target'
  nodeId?: string
  form: ReactNode
  viewForm?: boolean
  showForm?: () => void
}

export const NodeWrapper: React.FC<NodeWrapperProps> = ({
  children,
  form,
  onDelete,
  typeHandle,
  nodeId,
  viewForm = false,
  showForm,
}) => {
  const handleDelete = () => {
    if (onDelete && nodeId) {
      onDelete()
    }
  }

  return (
    <div className="custom-node border bg-white p-5 rounded-2xl">
      <div className="node-content flex flex-col gap-5">
        {viewForm ? form : children}
        {viewForm === false && (
          <button
            onClick={showForm}
            className="bg-gray-500/20 w-full rounded-sm py-2 cursor-pointer transition-all hover:bg-gray-200/70"
          >
            Изменить
          </button>
        )}
        <button
          onClick={handleDelete}
          className="bg-gray-500/20 w-full rounded-sm py-2 cursor-pointer transition-all hover:bg-gray-200/70"
        >
          Удалить
        </button>
      </div>
      <Handle
        className="scale-250"
        type={typeHandle}
        position={Position.Bottom}
      />
    </div>
  )
}
