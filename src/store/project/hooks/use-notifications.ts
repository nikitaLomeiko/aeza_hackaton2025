import { useState } from 'react'
import { NotificationItem } from '../components/notifications-list'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Приглашение в проект',
      description:
        'Вас приглашают присоединиться к проекту "Разработка Docker Compose"',
      type: 'info' as const,
    },
    {
      id: '2',
      title: 'Запрос на доступ',
      description: 'Пользователь John Doe запрашивает доступ к вашему проекту',
      type: 'warning' as const,
    },
    {
      id: '3',
      title: 'Ошибка синхронизации',
      description: 'Не удалось синхронизировать данные с сервером',
      type: 'error' as const,
    },
  ])

  const handleAcceptNotification = async (id: string) => {
    console.log('Принято уведомление:', id)
    // Логика принятия уведомления
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    )
  }

  const handleRejectNotification = (id: string) => {
    console.log('Отклонено уведомление:', id)
    // Логика отклонения уведомления
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    )
  }

  const notificationsCount = notifications.length

  return {
    notifications,
    notificationsCount,
    handleAcceptNotification,
    handleRejectNotification,
  }
}
