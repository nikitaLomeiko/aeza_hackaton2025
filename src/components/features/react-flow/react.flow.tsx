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
import { $project, setNodesByCurrentProject } from 'store/project'
import { CustomNode } from './nodes/service.node'
import { VolumeInfo } from './nodes/volume.node'
import { debounce } from 'lodash'
import { NetworkNode } from './nodes/network.node'
import { SecretInfo } from './nodes/secret.node'

const customNode = {
  volume: VolumeInfo,
  service: CustomNode,
  network: NetworkNode,
  secret: SecretInfo
}

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

  useEffect(() => console.log(currentProject?.id), [currentProject?.id])

  useEffect(() => {
    if (currentProject?.nodes) {
      setNodes(currentProject.nodes)
    } else {
      setNodes([])
    }
  }, [currentProject?.nodes])

  const debouncedSetNodes = useMemo(
    () =>
      debounce((nodes: Node[]) => {
        setNodesByCurrentProject(nodes)
        console.log('sdgsdg')
      }, 200),
    []
  )

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot))
      debouncedSetNodes(nodes)
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
        nodeTypes={customNode}
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
