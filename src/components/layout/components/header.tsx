import { InviteModal } from 'components/features/invite-modal'
import {
  NotificationsButton,
  NotificationsModal,
} from 'components/features/notification-modal'
import { GitHubLoginModal } from 'components/features/react-flow/components/GitHubLoginModal'
import { useUnit } from 'effector-react'
import React, { useState } from 'react'
import { $project } from 'store/project'
import { useNotifications } from 'store/project/hooks/use-notifications'

export const Header: React.FC<{ onMenuToggle: () => void }> = ({
  onMenuToggle,
}) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [isVisibleLogin, setIsVisibleLogin] = useState(false)
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false)

  const {
    notifications,
    notificationsCount,
    handleAcceptNotification,
    handleRejectNotification,
  } = useNotifications()

  const projectState = useUnit($project)
  const currentProjectId = projectState.currentId

  const inviteHandler = async () => {
    if (localStorage.getItem('authToken')) {
      setIsInviteModalOpen(true)
      return
    }
    setIsVisibleLogin(true)
  }

  return (
    <header className="relative px-3 sm:px-4 pt-3 sm:pt-4">
      {/* Фон с размытием */}
      <div className="absolute inset-0 mx-3 sm:mx-4 mt-3 sm:mt-4 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm"></div>

      {/* Контент header */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 sm:h-20 px-3 sm:px-6">
          {/* Левая часть - меню и лого */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Кнопка меню для мобильных */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-xl bg-white/80 hover:bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-800 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Логотип */}
            <div className="flex items-center space-x-2 sm:space-x-4 ml-4">
              <div className="flex items-center justify-center">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 32 32"
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M 12 6 L 12 9 L 6 9 L 6 12 L 3 12 L 3 15 L 2.0625 15 C 1.753906 15.007813 1.464844 15.15625 1.28125 15.40625 C 1.28125 15.40625 1.195313 15.511719 1.15625 15.59375 C 1.117188 15.675781 1.089844 15.800781 1.0625 15.90625 C 1.003906 16.121094 0.96875 16.363281 0.96875 16.71875 C 0.96875 17.40625 1.050781 18.167969 1.25 18.9375 C 1.164063 18.957031 1.070313 18.980469 1 19 L 1.28125 19 C 1.488281 19.773438 1.804688 20.550781 2.25 21.3125 C 2.261719 21.332031 2.269531 21.355469 2.28125 21.375 C 2.28125 21.386719 2.28125 21.394531 2.28125 21.40625 C 2.339844 21.648438 2.484375 21.859375 2.6875 22 C 2.699219 22.011719 2.707031 22.019531 2.71875 22.03125 C 2.886719 22.265625 3.054688 22.496094 3.25 22.71875 C 4.886719 24.601563 7.527344 26.03125 11.28125 26.03125 C 17.046875 26.03125 22.039063 23.65625 25.03125 19 L 30.09375 19 C 29.460938 18.839844 28.085938 18.609375 28.3125 17.78125 C 27.613281 18.589844 26.320313 18.761719 25.25 18.625 C 25.601563 18.042969 25.929688 17.429688 26.21875 16.78125 C 27.875 16.683594 29.132813 16.125 29.84375 15.4375 C 30.65625 14.652344 30.90625 13.75 30.90625 13.75 C 31.011719 13.375 30.890625 12.972656 30.59375 12.71875 C 30.59375 12.71875 29.082031 11.660156 26.90625 11.875 C 26.160156 9.882813 24.59375 8.90625 24.59375 8.90625 C 24.386719 8.785156 24.144531 8.738281 23.90625 8.78125 C 23.746094 8.816406 23.59375 8.890625 23.46875 9 C 23.46875 9 23.011719 9.40625 22.65625 10.0625 C 22.300781 10.71875 21.980469 11.714844 22.09375 12.96875 C 22.136719 13.429688 22.417969 13.835938 22.59375 14.28125 C 22.46875 14.359375 22.351563 14.449219 22.1875 14.53125 C 21.683594 14.777344 20.996094 15 20.09375 15 L 20 15 L 20 12 L 17 12 L 17 6 Z M 14 8 L 15 8 L 15 9 L 14 9 Z M 8 11 L 9 11 L 9 12 L 8 12 Z M 11 11 L 12 11 L 12 12 L 11 12 Z M 14 11 L 15 11 L 15 12 L 14 12 Z M 24.34375 11.3125 C 24.703125 11.71875 25.09375 12.292969 25.25 13.125 C 25.300781 13.402344 25.464844 13.640625 25.703125 13.789063 C 25.941406 13.9375 26.230469 13.980469 26.5 13.90625 C 27.40625 13.660156 28.066406 13.738281 28.53125 13.875 C 28.476563 13.941406 28.511719 13.929688 28.4375 14 C 27.980469 14.441406 27.214844 14.933594 25.625 14.875 C 25.203125 14.859375 24.816406 15.109375 24.65625 15.5 C 24.207031 16.613281 23.683594 17.613281 23.0625 18.5 C 21.585938 19.074219 18.300781 18.652344 18.03125 17.90625 C 17.054688 19.050781 14.042969 19.050781 13.0625 17.90625 C 12.746094 18.785156 8.1875 19.191406 7.40625 18.0625 C 6.777344 18.648438 4.488281 19.039063 3.1875 18.15625 C 3.105469 17.753906 3.046875 17.359375 3.03125 17 L 20.09375 17 C 21.339844 17 22.34375 16.664063 23.0625 16.3125 C 23.421875 16.136719 23.722656 15.960938 23.9375 15.8125 C 24.152344 15.664063 24.332031 15.53125 24.28125 15.5625 C 24.527344 15.417969 24.699219 15.171875 24.75 14.890625 C 24.804688 14.609375 24.738281 14.320313 24.5625 14.09375 C 24.296875 13.746094 24.144531 13.320313 24.09375 12.78125 C 24.03125 12.078125 24.191406 11.671875 24.34375 11.3125 Z M 5 14 L 6 14 L 6 15 L 5 15 Z M 8 14 L 9 14 L 9 15 L 8 15 Z M 11 14 L 12 14 L 12 15 L 11 15 Z M 14 14 L 15 14 L 15 15 L 14 15 Z M 17 14 L 18 14 L 18 15 L 17 15 Z M 3.40625 19 L 22.6875 19 C 20.054688 22.40625 16.074219 24.03125 11.28125 24.03125 C 8.769531 24.03125 7.007813 23.355469 5.75 22.375 C 7.875 22.300781 9.40625 21.75 9.40625 21.75 C 9.949219 21.644531 10.308594 21.121094 10.203125 20.578125 C 10.097656 20.035156 9.574219 19.675781 9.03125 19.78125 C 8.988281 19.789063 8.945313 19.800781 8.90625 19.8125 C 8.851563 19.828125 8.800781 19.851563 8.75 19.875 C 8.75 19.875 6.558594 20.59375 3.96875 20.28125 C 3.730469 19.855469 3.546875 19.433594 3.40625 19 Z M 10.71875 19.1875 C 10.398438 19.1875 10.125 19.457031 10.125 19.78125 C 10.125 20.101563 10.398438 20.375 10.71875 20.375 C 11.039063 20.375 11.28125 20.101563 11.28125 19.78125 C 11.28125 19.703125 11.277344 19.632813 11.25 19.5625 C 11.210938 19.636719 11.121094 19.6875 11.03125 19.6875 C 10.898438 19.6875 10.8125 19.570313 10.8125 19.4375 C 10.8125 19.347656 10.835938 19.289063 10.90625 19.25 C 10.839844 19.222656 10.792969 19.1875 10.71875 19.1875 Z"></path>
                </svg>
              </div>

              {/* Название приложения - скрывается на планшетах */}
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent leading-tight hidden md:block">
                  DockerNet Designer
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide hidden lg:block">
                  Visual Docker Compose Builder
                </p>
              </div>
            </div>
          </div>

          {/* Правая часть - пользователь и действия */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Кнопка приглашения - урезаем раньше */}
            <button
              onClick={inviteHandler}
              className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-3 sm:py-2.5 lg:px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 group"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <span className="text-sm font-semibold hidden sm:inline-block lg:hidden xl:inline-block">
                Пригласить
              </span>
              <span className="text-sm font-semibold sm:hidden lg:inline-block xl:hidden">
                Invite
              </span>
            </button>

            {/* Уведомления */}
            <div className="ml-1 sm:ml-2">
              <NotificationsButton
                count={notificationsCount}
                onClick={() => setIsNotificationsModalOpen(true)}
              />
            </div>

            {/* Профиль пользователя - урезаем информацию раньше */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 pl-2 sm:pl-3 lg:pl-4 border-l border-gray-200/60 ml-1 sm:ml-2">
              <div className="text-right hidden lg:block"></div>
              <div className="text-right hidden sm:block lg:hidden">
                <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                  А. Иванов
                </p>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-lg">
                <span className="hidden sm:inline">АИ</span>
                <span className="sm:hidden text-xs">АИ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальные окна */}
      <GitHubLoginModal
        isOpen={isVisibleLogin}
        onClose={() => setIsVisibleLogin(false)}
        githubAuthUrl="http://185.221.199.159:8080/auth?provider=github"
      />

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        projectId={currentProjectId}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onAcceptNotification={handleAcceptNotification}
        onRejectNotification={handleRejectNotification}
      />
    </header>
  )
}
