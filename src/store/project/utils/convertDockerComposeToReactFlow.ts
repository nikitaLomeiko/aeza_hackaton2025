import { Edge, Node } from '@xyflow/react'
import { DockerComposeConfig } from 'types/docker-compose.type'
import { generateId } from './generateId'

interface ReactFlowConversionResult {
  nodes: Node[]
  edges: Edge[]
}

interface LayoutConfig {
  layerSpacing: number
  nodeSpacing: number
  startY: number
  layerHeight: number
}

export const convertDockerComposeToReactFlow = (
  composeConfig: DockerComposeConfig
): ReactFlowConversionResult => {
  const nodes: Node[] = []
  const edges: Edge[] = []

  const layoutConfig: LayoutConfig = {
    layerSpacing: 800,
    nodeSpacing: 450,
    startY: 100,
    layerHeight: 100,
  }

  // Группируем узлы по типам
  const serviceNodes: Node[] = []
  const networkNodes: Node[] = []
  const volumeNodes: Node[] = []
  const secretNodes: Node[] = []
  const configNodes: Node[] = []

  // Создаем узлы для сервисов (основной слой)
  Object.entries(composeConfig.services).forEach(
    ([serviceName, serviceConfig]) => {
      serviceNodes.push({
        id: generateId(),
        type: 'service',
        position: { x: 0, y: 0 }, // Позиция будет установлена позже
        data: {
          container_name: serviceName,
          label: serviceName,
          ...serviceConfig,
        },
      })
    }
  )

  // Создаем узлы для сетей (нижний слой 1)
  if (composeConfig.networks) {
    Object.keys(composeConfig.networks).forEach((networkName) => {
      networkNodes.push({
        id: generateId(),
        type: 'network',
        position: { x: 0, y: 0 },
        data: {
          label: networkName,
          name: networkName,
          ...composeConfig.networks![networkName],
        },
      })
    })
  }

  // Создаем узлы для volumes (нижний слой 2)
  if (composeConfig.volumes) {
    Object.keys(composeConfig.volumes).forEach((volumeName) => {
      volumeNodes.push({
        id: generateId(),
        type: 'volume',
        position: { x: 0, y: 0 },
        data: {
          label: volumeName,
          type: 'volume',
          config: composeConfig.volumes![volumeName],
        },
      })
    })
  }

  // Создаем узлы для secrets (нижний слой 3)
  if (composeConfig.secrets) {
    Object.keys(composeConfig.secrets).forEach((secretName) => {
      secretNodes.push({
        id: generateId(),
        type: 'secret',
        position: { x: 0, y: 0 },
        data: {
          label: secretName,
          type: 'secret',
          config: composeConfig.secrets![secretName],
        },
      })
    })
  }

  // Создаем узлы для configs (нижний слой 4)
  if (composeConfig.configs) {
    Object.keys(composeConfig.configs).forEach((configName) => {
      configNodes.push({
        id: generateId(),
        type: 'config',
        position: { x: 0, y: 0 },
        data: {
          label: configName,
          type: 'config',
          config: composeConfig.configs![configName],
        },
      })
    })
  }

  // Располагаем узлы по слоям
  const allLayers = [
    serviceNodes,
    networkNodes,
    volumeNodes,
    secretNodes,
    configNodes,
  ]

  allLayers.forEach((layerNodes, layerIndex) => {
    if (layerNodes.length === 0) return

    const layerY = layoutConfig.startY + layerIndex * layoutConfig.layerSpacing

    // Центрируем узлы в слое
    const totalWidth = (layerNodes.length - 1) * layoutConfig.nodeSpacing
    const startX = -totalWidth / 2

    layerNodes.forEach((node, nodeIndex) => {
      node.position = {
        x: startX + nodeIndex * layoutConfig.nodeSpacing,
        y: layerY,
      }
      nodes.push(node)
    })
  })

  // Создаем edges для связей сервисов с сетями и volumes
  Object.entries(composeConfig.services).forEach(
    ([serviceName, serviceConfig]) => {
      const serviceNode = nodes.find(
        (node) => node.data.label === serviceName && node.type === 'service'
      )

      if (!serviceNode) return

      // Связываем сервисы с сетями
      if (serviceConfig.networks) {
        const networks = Array.isArray(serviceConfig.networks)
          ? serviceConfig.networks
          : Object.keys(serviceConfig.networks)

        networks.forEach((networkName) => {
          const networkNode = nodes.find(
            (node) => node.data.label === networkName && node.type === 'network'
          )
          if (networkNode) {
            edges.push({
              id: `edge-${serviceNode.id}-${networkNode.id}-network`,
              source: serviceNode.id,
              target: networkNode.id,
              type: 'smoothstep',
            })
          }
        })
      }

      // Связываем сервисы с volumes
      if (serviceConfig.volumes && Array.isArray(serviceConfig.volumes)) {
        serviceConfig.volumes.forEach((volumeDef) => {
          if (typeof volumeDef === 'string') {
            const volumeName = volumeDef.split(':')[0]
            const volumeNode = nodes.find(
              (node) => node.data.label === volumeName && node.type === 'volume'
            )
            if (volumeNode) {
              edges.push({
                id: `edge-${serviceNode.id}-${volumeNode.id}-volume`,
                source: serviceNode.id,
                target: volumeNode.id,
                type: 'smoothstep',
              })
            }
          }
        })
      }

      // Связываем сервисы с secrets
      if (serviceConfig.secrets && Array.isArray(serviceConfig.secrets)) {
        serviceConfig.secrets.forEach((secretDef) => {
          const secretName =
            typeof secretDef === 'string' ? secretDef : secretDef.source
          const secretNode = nodes.find(
            (node) => node.data.label === secretName && node.type === 'secret'
          )
          if (secretNode) {
            edges.push({
              id: `edge-${serviceNode.id}-${secretNode.id}-secret`,
              source: serviceNode.id,
              target: secretNode.id,
              type: 'smoothstep',
            })
          }
        })
      }

      // Связываем сервисы с configs
      if (serviceConfig.configs && Array.isArray(serviceConfig.configs)) {
        serviceConfig.configs.forEach((configDef) => {
          const configName =
            typeof configDef === 'string' ? configDef : configDef.source
          const configNode = nodes.find(
            (node) => node.data.label === configName && node.type === 'config'
          )
          if (configNode) {
            edges.push({
              id: `edge-${serviceNode.id}-${configNode.id}-config`,
              source: serviceNode.id,
              target: configNode.id,
              type: 'smoothstep',
            })
          }
        })
      }
    }
  )

  return { nodes, edges }
}
