import React, { useEffect } from 'react'
import { Modal } from 'components/ui/modal'
import { NotificationItem, NotificationsList } from './notification-list'
import { NotificationsEmpty } from './notifications-empty'
import { ApiClient } from 'api/client'

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

  const fetchData = async () => {
    const token = localStorage.getItem('authToken')

    const { data } = await ApiClient({
      url: '/userinfo',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    console.log(data)
  }

  useEffect(() => {
    fetchData()
  }, [])

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
