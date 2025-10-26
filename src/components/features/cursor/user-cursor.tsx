import React from 'react'
import { IUserCursor as UserCursorType } from 'store/websockets/cursors.store'

interface UserCursorProps {
  cursor: UserCursorType
}

export const UserCursor: React.FC<UserCursorProps> = ({ cursor }) => {
  return (
    <div
      className="absolute pointer-events-none z-50 transition-all duration-150 ease-out"
      style={{
        left: cursor.position.x,
        top: cursor.position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Анимированный курсор */}
      <div className="relative">
        {/* Внешний круг */}
        <div
          className="w-4 h-4 rounded-full border-2 animate-pulse"
          style={{
            borderColor: cursor.color,
            backgroundColor: `${cursor.color}20`,
          }}
        />

        {/* Внутренняя точка */}
        <div
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: cursor.color }}
        />
      </div>

      {/* Имя пользователя с тенью */}
      <div
        className="absolute top-5 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap shadow-lg"
        style={{ backgroundColor: cursor.color }}
      >
        {cursor.userName}
        {/* Треугольный указатель */}
        <div
          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2"
          style={{
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderBottom: `4px solid ${cursor.color}`,
          }}
        />
      </div>
    </div>
  )
}
