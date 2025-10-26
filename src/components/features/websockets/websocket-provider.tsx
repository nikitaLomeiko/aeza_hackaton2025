import React, { useEffect } from 'react'
import { useWebSocket } from '../hooks/use-websocket'
import { useAuth } from '../providers/auth-provider'

interface WebSocketProviderProps {
  children: React.ReactNode
  projectId: string
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  projectId,
}) => {
  const { connect, disconnect, isConnected, subscribe } = useWebSocket()
  const { token } = useAuth()

  useEffect(() => {
    if (projectId && token) {
      const userId = localStorage.getItem('userId') || `user-${Date.now()}`

      connect(projectId, token, userId)

      // Автоматическая подписка на проект
      subscribe(projectId)
    }

    return () => {
      disconnect()
    }
  }, [projectId, token, connect, disconnect, subscribe])

  // Можно показать статус подключения
  if (!isConnected) {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-50 bg-yellow-100 border border-yellow-400 rounded px-3 py-2 text-sm">
          Подключение к серверу...
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-50 bg-green-100 border border-green-400 rounded px-3 py-2 text-sm">
        ✓ Соединение установлено
      </div>
      {children}
    </div>
  )
}
