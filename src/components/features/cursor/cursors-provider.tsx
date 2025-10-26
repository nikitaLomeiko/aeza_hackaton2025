import React, { useCallback, useEffect } from 'react'
import { useUnit } from 'effector-react'
import {
  $userCursors,
  updateLocalCursor,
  connectCursorsSocket,
  disconnectCursorsSocket,
} from 'store/websockets/cursors.store'
import { UserCursor } from './user-cursor'

interface CursorsProviderProps {
  children: React.ReactNode
  projectId: string
}

export const CursorsProvider: React.FC<CursorsProviderProps> = ({
  children,
  projectId,
}) => {
  const userCursors = useUnit($userCursors)
  const updateLocalCursorFn = useUnit(updateLocalCursor)
  const connectCursorsSocketFn = useUnit(connectCursorsSocket)
  const disconnectCursorsSocketFn = useUnit(disconnectCursorsSocket)

  // Подключаемся к сокету при монтировании
  useEffect(() => {
    const userId = localStorage.getItem('userId') || `user-${Date.now()}`
    const userName = localStorage.getItem('userName') || 'Anonymous'

    connectCursorsSocketFn({
      projectId,
      userId,
      userName,
    })

    return () => {
      disconnectCursorsSocketFn()
    }
  }, [projectId, connectCursorsSocketFn, disconnectCursorsSocketFn])

  // Обработчик движения мыши
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      updateLocalCursorFn({
        x: e.clientX,
        y: e.clientY,
      })
    },
    [updateLocalCursorFn]
  )

  // Подписываемся на движение мыши
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  return (
    <div className="relative w-full h-full">
      {children}

      {/* Отображение курсоров других пользователей */}
      {userCursors.map((cursor) => (
        <UserCursor key={cursor.userId} cursor={cursor} />
      ))}
    </div>
  )
}
