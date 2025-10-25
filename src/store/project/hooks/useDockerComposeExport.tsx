import { Edge, Node } from '@xyflow/react'
import { convertReactFlowToDockerCompose } from '../utils/convertReactFlowToDockerCompose'

export const useDockerComposeExport = () => {
  const exportToYaml = (
    nodes: Node[],
    edges: Edge[],
    filename: string = 'docker-compose.yml'
  ) => {
    try {
      const yamlContent = convertReactFlowToDockerCompose({ nodes, edges })

      // Создаем Blob и скачиваем файл
      const blob = new Blob([yamlContent], { type: 'text/yaml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return true
    } catch (error) {
      console.error('Error exporting Docker Compose:', error)
      return false
    }
  }

  const getYamlString = (nodes: Node[], edges: Edge[]): string => {
    return convertReactFlowToDockerCompose({ nodes, edges })
  }

  return { exportToYaml, getYamlString }
}
