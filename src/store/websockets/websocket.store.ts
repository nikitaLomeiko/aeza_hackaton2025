import { createEvent, createStore, sample } from 'effector'
import { io, Socket } from 'socket.io-client'

// Типы сообщений (соответствуют бэкенду)
export enum MessageType {
  Lock = 32, // 1 << 5
  Update = 64, // 1 << 6
  Unlock = 128, // 1 << 7
  Sub = 256, // 1 << 8
  Unsub = 512, // 1 << 9
}

export interface WebSocketMessage {
  type: MessageType
  content: any
}

export interface LockMessage {
  projectId: string
  userId: string
  action: string
}

export interface UpdateMessage {
  projectId: string
  nodes: any[]
  edges: any[]
}

// События
export const connectWebSocket = createEvent<{
  projectId: string
  token: string
  userId: string
}>()
export const disconnectWebSocket = createEvent()
export const sendMessage = createEvent<WebSocketMessage>()
export const subscribeToProject = createEvent<string>()
export const unsubscribeFromProject = createEvent<string>()
export const acquireLock = createEvent<LockMessage>()
export const releaseLock = createEvent<string>()
export const updateProject = createEvent<UpdateMessage>()

// Сторы
export const $socket = createStore<Socket | null>(null)
export const $isConnected = createStore(false)
export const $subscribedProjects = createStore<string[]>([])

// Подключение к WebSocket
$socket
  .on(connectWebSocket, (_, { projectId, token, userId }) => {
    const socket = io('http://localhost:8080/collab', {
      // URL вашего бэкенда
      auth: {
        token: token,
      },
      query: {
        projectId,
        userId,
      },
      transports: ['websocket'],
    })

    // Обработчики событий
    socket.on('connect', () => {
      console.log('WebSocket connected')
    })

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })

    // Обработка сообщений от сервера
    socket.on('lock', (data: any) => {
      console.log('Lock received:', data)
      // Обработка блокировки
    })

    socket.on('unlock', (data: any) => {
      console.log('Unlock received:', data)
      // Обработка разблокировки
    })

    socket.on('message', (encodedData: string) => {
      try {
        // Декодируем base64 сообщение
        const decoded = atob(encodedData)
        console.log('Message received:', decoded)
      } catch (error) {
        console.error('Error decoding message:', error)
      }
    })

    // Автоматическая подписка на проект при подключении
    socket.emit('connect', {
      pid: projectId,
    })

    return socket
  })
  .on(disconnectWebSocket, (socket) => {
    socket?.disconnect()
    return null
  })

$isConnected.on($socket, (_, socket) => socket?.connected || false)

// Отправка сообщений
sample({
  source: $socket,
  clock: sendMessage,
  fn: (socket, message) => {
    if (socket) {
      socket.emit('message', message)
    }
  },
})

// Подписка на проект
sample({
  source: $socket,
  clock: subscribeToProject,
  fn: (socket, projectId) => {
    if (socket) {
      const subMessage = {
        type: MessageType.Sub,
        content: { pid: projectId },
      }
      socket.emit('message', subMessage)
    }
  },
})

// Отписка от проекта
sample({
  source: $socket,
  clock: unsubscribeFromProject,
  fn: (socket, projectId) => {
    if (socket) {
      const unsubMessage = {
        type: MessageType.Unsub,
        content: { pid: projectId },
      }
      socket.emit('message', unsubMessage)
    }
  },
})

// Запрос блокировки
sample({
  source: $socket,
  clock: acquireLock,
  fn: (socket, lockData) => {
    if (socket) {
      const lockMessage = {
        type: MessageType.Lock,
        content: lockData,
      }
      socket.emit('message', lockMessage)
    }
  },
})

// Снятие блокировки
sample({
  source: $socket,
  clock: releaseLock,
  fn: (socket, projectId) => {
    if (socket) {
      const unlockMessage = {
        type: MessageType.Unlock,
        content: { pid: projectId },
      }
      socket.emit('message', unlockMessage)
    }
  },
})

// Отправка обновлений проекта
sample({
  source: $socket,
  clock: updateProject,
  fn: (socket, updateData) => {
    if (socket) {
      const updateMessage = {
        type: MessageType.Update,
        content: updateData,
      }
      socket.emit('message', updateMessage)
    }
  },
})
