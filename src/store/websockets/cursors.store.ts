import { createEvent, createStore, sample } from 'effector'
import { io, Socket } from 'socket.io-client'

export interface CursorPosition {
  x: number
  y: number
}

export interface IUserCursor {
  userId: string
  userName: string
  color: string
  position: CursorPosition
  lastSeen: number
}

// События
export const connectCursorsSocket = createEvent<{
  projectId: string
  userId: string
  userName: string
}>()
export const disconnectCursorsSocket = createEvent()
export const updateLocalCursor = createEvent<CursorPosition>()
export const setUserCursors = createEvent<IUserCursor[]>()
export const addUserCursor = createEvent<IUserCursor>()
export const updateUserCursor = createEvent<{
  userId: string
  position: CursorPosition
}>()
export const removeUserCursor = createEvent<string>()

// Сторы
export const $cursorsSocket = createStore<Socket | null>(null)
export const $isCursorsConnected = createStore(false)
export const $userCursors = createStore<IUserCursor[]>([])
export const $localCursor = createStore<CursorPosition>({ x: 0, y: 0 })

// Генерация цвета для пользователя
const generateUserColor = (userId: string): string => {
  const colors = [
    '#EF4444',
    '#F59E0B',
    '#10B981',
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
    '#84CC16',
  ]
  const index =
    userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length
  return colors[index]
}

// Подключение сокета для курсоров
$cursorsSocket
  .on(connectCursorsSocket, (_, { projectId, userId, userName }) => {
    const socket = io('http://localhost:3001', {
      query: {
        projectId,
        userId,
        userName,
        type: 'cursors',
      },
    })

    socket.on('connect', () => {
      console.log('Cursors socket connected')
    })

    socket.on('cursors:update', (cursors: IUserCursor[]) => {
      setUserCursors(cursors)
    })

    socket.on('cursor:move', (cursor: IUserCursor) => {
      updateUserCursor({ userId: cursor.userId, position: cursor.position })
    })

    socket.on('cursor:join', (cursor: IUserCursor) => {
      addUserCursor(cursor)
    })

    socket.on('cursor:leave', (userId: string) => {
      removeUserCursor(userId)
    })

    socket.on('disconnect', () => {
      setUserCursors([])
    })

    return socket
  })
  .on(disconnectCursorsSocket, (socket) => {
    socket?.disconnect()
    return null
  })

$userCursors
  .on(setUserCursors, (_, cursors) => cursors)
  .on(addUserCursor, (cursors, newCursor) => {
    const exists = cursors.find((c) => c.userId === newCursor.userId)
    if (exists) {
      return cursors.map((c) => (c.userId === newCursor.userId ? newCursor : c))
    }
    return [...cursors, newCursor]
  })
  .on(updateUserCursor, (cursors, { userId, position }) => {
    return cursors.map((cursor) =>
      cursor.userId === userId
        ? { ...cursor, position, lastSeen: Date.now() }
        : cursor
    )
  })
  .on(removeUserCursor, (cursors, userId) => {
    return cursors.filter((cursor) => cursor.userId !== userId)
  })

$localCursor.on(updateLocalCursor, (_, position) => position)

$isCursorsConnected.on(
  $cursorsSocket,
  (_, socket) => socket?.connected || false
)

// Отправка движения курсора на сервер
sample({
  source: { socket: $cursorsSocket, localCursor: $localCursor },
  clock: updateLocalCursor,
  fn: ({ socket, localCursor }, position) => {
    socket?.emit('cursor:move', position)
  },
})

// Очистка неактивных курсоров (каждые 5 секунд)
setInterval(() => {
  const now = Date.now()
  const cursors = $userCursors.getState()
  const activeCursors = cursors.filter(
    (cursor) => now - cursor.lastSeen < 10000
  ) // 10 секунд
  if (activeCursors.length !== cursors.length) {
    setUserCursors(activeCursors)
  }
}, 5000)
