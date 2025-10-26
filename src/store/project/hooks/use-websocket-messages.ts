import { useEffect } from 'react'
import { useWebSocket } from './use-websocket'
import { MessageType } from '../store/websocket.store'

interface UseWebSocketMessagesProps {
  onLock?: (data: any) => void
  onUnlock?: (data: any) => void
  onUpdate?: (data: any) => void
  onMessage?: (data: any) => void
}

export const useWebSocketMessages = ({
  onLock,
  onUnlock,
  onUpdate,
  onMessage,
}: UseWebSocketMessagesProps = {}) => {
  const { socket } = useWebSocket()

  useEffect(() => {
    if (!socket) return

    const handleLock = (data: any) => {
      console.log('Lock event:', data)
      onLock?.(data)
    }

    const handleUnlock = (data: any) => {
      console.log('Unlock event:', data)
      onUnlock?.(data)
    }

    const handleMessage = (encodedData: string) => {
      try {
        const decoded = atob(encodedData)
        const data = JSON.parse(decoded)
        console.log('Message event:', data)
        onMessage?.(data)
      } catch (error) {
        console.error('Error processing message:', error)
      }
    }

    // Подписываемся на события
    socket.on('lock', handleLock)
    socket.on('unlock', handleUnlock)
    socket.on('message', handleMessage)

    // Отписываемся при размонтировании
    return () => {
      socket.off('lock', handleLock)
      socket.off('unlock', handleUnlock)
      socket.off('message', handleMessage)
    }
  }, [socket, onLock, onUnlock, onMessage])
}
