import React from 'react'
import { Notification } from './notification'

export interface NotificationItem {
  id: string
  title: string
  description: string
  type?: 'info' | 'warning' | 'success' | 'error'
}

interface NotificationsListProps {
  notifications: NotificationItem[]
  onAccept: (id: string) => void
  onReject: (id: string) => void
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onAccept,
  onReject,
}) => {
  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          title={notification.title}
          description={notification.description}
          type={notification.type}
          onAccept={() => onAccept(notification.id)}
          onReject={() => onReject(notification.id)}
          acceptText="Принять"
          rejectText="Отклонить"
        />
      ))}
    </div>
  )
}
