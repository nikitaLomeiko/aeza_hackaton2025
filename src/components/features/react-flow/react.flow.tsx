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
import { debounce } from 'lodash'
import { NetworkNode } from './nodes/network.node'
import { SecretInfo } from './nodes/secret.node'
import { ConfigInfo } from './nodes/config.node'
import { Toolbar } from './components/toolbar'
import { Modal } from 'components/ui/modal'
import { PathForm } from 'components/forms/path-form'
import { deleteNode } from 'store/project/project.store'
import { CollaboratorButtons } from './components/collaborator-buttons'

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
      nodeSource.data.volumes = [
        ...((nodeSource.data.volumes as string[]) || []),
        `${nodeTarget.data.name}:${path}`,
      ]
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
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4">
              <svg
                className="w-8 h-8 text-white"
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
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Docker Compose Constructor
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Визуальный конструктор для создания и редактирования
              docker-compose файлов
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Карточка создания */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Создать новую конфигурацию
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Начните с чистого листа и создайте docker-compose файл с помощью
                визуального редактора
              </p>
              <div className="text-xs text-blue-600 font-medium">
                Откройте sidebar для начала работы →
              </div>
            </div>

            {/* Карточка импорта */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Импорт существующего
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Загрузите существующий docker-compose.yml файл для визуального
                редактирования
              </p>
              <div className="text-xs text-green-600 font-medium">
                Поддержка YAML формата
              </div>
            </div>

            {/* Карточка возможностей */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Все возможности Docker
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Полная поддержка services, networks, volumes, secrets и configs
              </p>
              <div className="text-xs text-purple-600 font-medium">
                Визуальное управление всеми компонентами
              </div>
            </div>
          </div>

          {/* Быстрый старт */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Быстрый старт
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Создайте конфигурацию
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Нажмите "Создать конфигурацию" в sidebar или импортируйте
                      существующий файл
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Добавьте компоненты
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Перетащите services, networks, volumes и другие компоненты
                      на рабочую область
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Настройте связи
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Соедините компоненты между собой для определения
                      зависимостей
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Экспортируйте результат
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Скачайте готовый docker-compose.yml файл для использования
                      в ваших проектах
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Статистика или фичи */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">∞</div>
              <div className="text-sm text-gray-600">Сервисов</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-green-600 mb-1">∞</div>
              <div className="text-sm text-gray-600">Сетей</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-purple-600 mb-1">∞</div>
              <div className="text-sm text-gray-600">Томов</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                100%
              </div>
              <div className="text-sm text-gray-600">Совместимость</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <span>{currentProject?.name}</span>
          <ReactFlow
            ref={kon}
            minZoom={0.1}
            nodes={nodes}
            edges={edges}
            nodeTypes={customNode}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDragStop={() => setNodesByCurrentProject(nodes)}
            onEdgeClick={(e, edge) =>
              setEdges((edges) => edges.filter((item) => item.id !== edge.id))
            }
            onConnect={onConnect}
            fitView
          >
            <Panel position="bottom-center">
              <Toolbar />
            </Panel>
            <Panel position="top-right">
              <CollaboratorButtons projectId={currentProject.id} />
            </Panel>
            <Controls />
            <MiniMap className="xl:block hidden" />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
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
