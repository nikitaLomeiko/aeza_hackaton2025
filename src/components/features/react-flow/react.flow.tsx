import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useUnit } from 'effector-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  $project,
  setNodesByCurrentProject,
} from 'store/project'
import { serviceNodeTypes } from './nodes/service.node'
import { throttle } from 'lodash';


const initialEdges: Edge[] = [
  {
    id: 'n1-n2',
    source: 'n1',
    target: 'n2',
  },
]

export const CustomReactFlow = () => {
  const projectState = useUnit($project)
  const currentProject = projectState.projects.find(
    (item) => item.id === projectState.currentId
  )

  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  useEffect(() => {
    if (currentProject?.nodes) {
      setNodes(currentProject.nodes)
    }
  }, [currentProject?.nodes])

  const throttledSetNodes = useMemo(
    () =>
      throttle((nodes: Node[]) => {
        setNodesByCurrentProject(nodes)
        console.log('sdgsdg')
      }, 1000),
    []
  )

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot))
      throttledSetNodes(nodes)
    },
    [nodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  )

  const onConnect = useCallback(
    (params: Connection | Edge) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  )

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <span>{currentProject?.name}</span>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={serviceNodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
