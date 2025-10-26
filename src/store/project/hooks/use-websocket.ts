import { useUnit } from 'effector-react'
import {
  $socket,
  $isConnected,
  connectWebSocket,
  disconnectWebSocket,
  subscribeToProject,
  unsubscribeFromProject,
  acquireLock,
  releaseLock,
  updateProject,
  MessageType,
} from '../store/websocket.store'

export const useWebSocket = () => {
  const socket = useUnit($socket)
  const isConnected = useUnit($isConnected)
  const connectWebSocketFn = useUnit(connectWebSocket)
  const disconnectWebSocketFn = useUnit(disconnectWebSocket)
  const subscribeToProjectFn = useUnit(subscribeToProject)
  const unsubscribeFromProjectFn = useUnit(unsubscribeFromProject)
  const acquireLockFn = useUnit(acquireLock)
  const releaseLockFn = useUnit(releaseLock)
  const updateProjectFn = useUnit(updateProject)

  const connect = (projectId: string, token: string, userId: string) => {
    connectWebSocketFn({ projectId, token, userId })
  }

  const disconnect = () => {
    disconnectWebSocketFn()
  }

  const subscribe = (projectId: string) => {
    subscribeToProjectFn(projectId)
  }

  const unsubscribe = (projectId: string) => {
    unsubscribeFromProjectFn(projectId)
  }

  const lock = (projectId: string, userId: string, action: string) => {
    acquireLockFn({ projectId, userId, action })
  }

  const unlock = (projectId: string) => {
    releaseLockFn(projectId)
  }

  const sendUpdate = (projectId: string, nodes: any[], edges: any[]) => {
    updateProjectFn({ projectId, nodes, edges })
  }

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    lock,
    unlock,
    sendUpdate,
    MessageType,
  }
}
