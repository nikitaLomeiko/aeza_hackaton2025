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
import { $project, setEdgesByCurrentProject, setNodesByCurrentProject } from 'store/project'
import { CustomNode } from './nodes/service.node'
import { VolumeInfo } from './nodes/volume.node'
import { debounce } from 'lodash'
import { NetworkNode } from './nodes/network.node'
import { SecretInfo } from './nodes/secret.node'
import { ConfigInfo } from './nodes/config.node'

const customNode = {
  volume: VolumeInfo,
  service: CustomNode,
  network: NetworkNode,
  secret: SecretInfo,
  config: ConfigInfo
}

export const CustomReactFlow = () => {
  const projectState = useUnit($project)

  const currentProject = projectState.projects.find(
    (item) => item.id === projectState.currentId
  )

  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  useEffect(() => {
    if (currentProject?.nodes) {
      setNodes(currentProject.nodes)
    } else {
      setNodes([])
    }
  }, [currentProject?.nodes])

  useEffect(() => {
    if (currentProject?.edges) {
      setEdges(currentProject.edges)
    } else {
      setEdges([])
    }
  }, [currentProject?.edges])

  useEffect(() => {
    setEdgesByCurrentProject(edges)
  }, [edges])

  const debouncedSetNodes = useMemo(
    () =>
      debounce((nodes: Node[]) => {
        setNodesByCurrentProject(nodes)
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
    (changes: EdgeChange[]) => {
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot))
    },
    []
  )

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot))
    },
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
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
