export const Header: React.FC<{onMenuToggle: () => void}> = ({ onMenuToggle }) => {
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
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Логотип */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <div className="hidden sm:flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NovaSphere
                </h1>
                <p className="text-xs text-gray-600 font-medium">Project Manager</p>
              </div>
            </div>
          </div>

          {/* Правая часть - пользователь */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Алексей Иванов</p>
                <p className="text-xs text-gray-500">Менеджер проектов</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                АИ
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};