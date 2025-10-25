import { Modal } from 'components/ui/modal'
import React from 'react'

interface GitHubLoginModalProps {
  isOpen: boolean
  onClose: () => void
  githubAuthUrl: string
}

export const GitHubLoginModal: React.FC<GitHubLoginModalProps> = ({
  isOpen,
  onClose,
  githubAuthUrl,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isLogin
      title="Вход через GitHub"
      size="sm"
    >
      <div className="p-6">
        {/* Заголовок и описание */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Войдите в свой аккаунт
          </h3>
          <p className="text-gray-600 text-sm">
            Для доступа к функциям платформы требуется авторизация через GitHub
          </p>
        </div>

        {/* Кнопка-ссылка GitHub */}
        <div className="space-y-4">
          <a
            href={githubAuthUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 no-underline"
            onClick={onClose} // Закрываем модалку при клике
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="text-sm font-medium">Продолжить с GitHub</span>
          </a>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>Авторизуясь, вы соглашаетесь с нашими</p>
            <p>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                условиями использования
              </a>{' '}
              и{' '}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                политикой конфиденциальности
              </a>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
