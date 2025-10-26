import {
  Background,
  Controls,
  Panel,
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
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  $project,
  changeNodeByCurrentProject,
  setEdgesByCurrentProject,
  setNodesByCurrentProject,
} from 'store/project'
import { CustomNode } from './nodes/service.node'
import { VolumeInfo } from './nodes/volume.node'
import { NetworkNode } from './nodes/network.node'
import { SecretInfo } from './nodes/secret.node'
import { ConfigInfo } from './nodes/config.node'
import { Toolbar } from './components/toolbar'
import { Modal } from 'components/ui/modal'
import { PathForm } from 'components/forms/path-form'
import { deleteNode } from 'store/project/project.store'
import { CursorsProvider } from '../cursor'

const customNode = {
  volume: VolumeInfo,
  service: CustomNode,
  network: NetworkNode,
  secret: SecretInfo,
  config: ConfigInfo,
}

export const CustomReactFlow = () => {
  const projectState = useUnit($project)
  const deleteNodeFn = useUnit(deleteNode)

  const kon = useRef<null | HTMLDivElement>(null)

  const currentProject = projectState.projects.find(
    (item) => item.id === projectState.currentId
  )

  const [openModal, setOpenModal] = useState(false)
  const [currentEdge, setCurrentEdge] = useState<{
    source: string
    target: string
  }>()

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

  const onChangeVolume = (path: string) => {
    const nodeSource = nodes.find(
      (nodeItem) => nodeItem.id === currentEdge?.source
    )
    const nodeTarget = nodes.find(
      (nodeItem) => nodeItem.id === currentEdge?.target
    )

    if (nodeSource?.data && nodeTarget?.data) {
      ;(nodeSource.data.volumes as string[]).push(
        `${nodeTarget.data.name}:${path}`
      )
      changeNodeByCurrentProject({ id: nodeSource.id, node: nodeSource })
    }
  }

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Проверяем, есть ли изменения удаления
      const removeChanges = changes.filter((change) => change.type === 'remove')

      if (removeChanges.length > 0) {
        console.log(kon.current)
        //@ts-ignore
        kon.current?.onclick()
        // Для удаления - немедленно вызываем deleteNode для каждой ноды
        removeChanges.forEach((change) => {
          if (change.type === 'remove' && change.id) {
            deleteNodeFn(change.id)
          }
        })
      }

      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot))
    },
    [nodes, deleteNodeFn]
  )

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot))
  }, [])

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot))
      if (nodes.find((node) => node.id === params.target)?.type === 'volume') {
        setCurrentEdge({ source: params.source, target: params.target })
        setOpenModal(true)
      }
    },
    [nodes]
  )

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {currentProject === undefined ? (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Добро пожаловать в панель управления
          </h1>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-gray-600">
              Выберите проект из sidebar для начала работы.
            </p>
          </div>
        </div>
      ) : (
        <>
          <CursorsProvider projectId={currentProject.id}>
            <span>{currentProject?.name}</span>
            <ReactFlow
              ref={kon}
              minZoom={0.1}
              nodes={nodes}
              edges={edges}
              nodeTypes={customNode}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onEdgeClick={(e, edge) =>
                setEdges((edges) => edges.filter((item) => item.id !== edge.id))
              }
              onConnect={onConnect}
              fitView
            >
              <Panel position="bottom-center">
                <Toolbar />
              </Panel>
              <Controls />
              <MiniMap />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </CursorsProvider>
        </>
      )}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <PathForm
          onSubmit={onChangeVolume}
          onCancel={() => setOpenModal(false)}
        />
      </Modal>
    </div>
  )
}
