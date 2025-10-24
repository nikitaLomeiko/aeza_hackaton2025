import { Handle, Position } from "@xyflow/react";
import { ReactNode } from "react";

export const NodeWrapper: React.FC<{ children: ReactNode; onDelete: () => void, typeHandle: 'source' | 'target' }> = ({ children, onDelete, typeHandle }) => {
  return (
    <div className="custom-node border bg-white p-5 rounded-2xl">
      <div className="node-content flex flex-col gap-5">
        {children}
        <button onClick={onDelete} className="bg-gray-500/20 w-full rounded-sm py-2 cursor-pointer transition-all hover:bg-gray-200/70">
          Удалить
        </button>
      </div>
      <Handle className="scale-250" type={typeHandle} position={Position.Bottom} />
    </div>
  );
};
