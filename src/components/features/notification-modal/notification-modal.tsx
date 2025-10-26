import React from 'react'
import { Modal } from 'components/ui/modal'
import { NotificationsList } from './notification-list'
import { NotificationsEmpty } from './notifications-empty'

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
  notifications: NotificationItem[]
  onAcceptNotification: (id: string) => void
  onRejectNotification: (id: string) => void
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onAcceptNotification,
  onRejectNotification,
}) => {
  const notificationsCount = notifications.length

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Уведомления (${notificationsCount})`}
      size="md"
    >
      <div className="p-6">
        {notifications.length === 0 ? (
          <NotificationsEmpty />
        ) : (
          <NotificationsList
            notifications={notifications}
            onAccept={onAcceptNotification}
            onReject={onRejectNotification}
          />
        )}
      </div>
    </Modal>
  )
}
