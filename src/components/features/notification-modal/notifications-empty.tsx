import React from 'react'

export const NotificationsEmpty: React.FC = () => {
  return (
    <div className="text-center py-8">
      <svg
        className="w-12 h-12 text-gray-400 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-5 5v-5zM4.858 4.858a4 4 0 015.656 0M12 4a8 8 0 018 8c0 1.892-.402 3.687-1.12 5.304M12 4a8 8 0 00-8 8c0 1.892.402 3.687 1.12 5.304m0 0a4 4 0 005.304 0"
        />
      </svg>
      <p className="text-gray-500">Нет новых уведомлений</p>
    </div>
  )
}
