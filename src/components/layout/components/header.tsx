import { InviteModal } from 'components/features/invite-modal'
import { GitHubLoginModal } from 'components/features/react-flow/components/GitHubLoginModal'
import { useUnit } from 'effector-react'
import { useState } from 'react'
import { $project } from 'store/project'

export const Header: React.FC<{ onMenuToggle: () => void }> = ({
  onMenuToggle,
}) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [isVisibeLogin, setIsViisbleLogin] = useState(false)

  const projectState = useUnit($project)
  const currentProjectId = projectState.currentId

  const inviteHandler = () => {
    setIsInviteModalOpen(true)
    // if (localStorage.getItem('token')) {
    //   setIsInviteModalOpen(true)
    //   return
    // }

    // setIsViisbleLogin(true)
  }

  return (
    <header className="relative">
      {/* Фон с размытием */}
      <div className="absolute top-2 left-2 inset-0 bg-white/70 backdrop-blur-xl rounded-3xl border-b border-white/30 shadow-sm"></div>

      {/* Контент header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Левая часть - меню и лого */}
          <div className="flex items-center space-x-4">
            {/* Кнопка меню для мобильных */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-700"
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
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>

              <div className="hidden sm:flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NovaSphere
                </h1>
                <p className="text-xs text-gray-600 font-medium">
                  Project Manager
                </p>
              </div>
            </div>
          </div>

          {/* Правая часть - пользователь */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  Алексей Иванов
                </p>
                <p className="text-xs text-gray-500">Менеджер проектов</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                АИ
              </div>
            </div>
            <button
              onClick={inviteHandler}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              title="Пригласить участника"
            >
              <svg
                className="w-5 h-5"
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
            </button>
          </div>
        </div>
      </div>

      <GitHubLoginModal
        isOpen={isVisibeLogin}
        onClose={() => setIsViisbleLogin(false)}
        githubAuthUrl="http://localhost:8080/auth?provider=github"
      />

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        projectId={currentProjectId}
      />
    </header>
  )
}
