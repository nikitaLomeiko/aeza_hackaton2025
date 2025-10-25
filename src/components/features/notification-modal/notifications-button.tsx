import React from 'react'
import BellIcon from './icon/bell.png'

interface NotificationsButtonProps {
  count: number
  onClick: () => void
}

export const NotificationsButton: React.FC<NotificationsButtonProps> = ({
  count,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      title="Уведомления"
    >
      <img className="w-5 h-5" src={BellIcon} alt="" />
      {/* Счетчик уведомлений */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}
