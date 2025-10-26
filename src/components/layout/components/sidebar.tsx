import { FileInput } from 'components/ui/file-input/file.input'
import { useUnit } from 'effector-react'
import React, { useState } from 'react'
import { convertDockerComposeToReactFlow, IProject } from 'store/project'
import {
  $project,
  addNewProject,
  deleteProject,
  selectProject,
} from 'store/project/project.store'

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const projectState = useUnit($project)

  const [newProjectName, setNewProjectName] = useState('')

  const createNewProject = () => {
    if (newProjectName.trim()) {
      const newProject: IProject = {
        id: String(Date.now()),
        name: newProjectName.trim(),
        status: 'active',
      }
      addNewProject(newProject)
      setNewProjectName('')
    }
  }

  const handleFileConverted = (jsonData: any, fileName: string) => {
    const { nodes, edges } = convertDockerComposeToReactFlow(jsonData)
    const newProject: IProject = {
      id: String(Date.now()),
      name: fileName,
      status: 'active',
      nodes,
      edges,
    }
    addNewProject(newProject)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активный'
      case 'completed':
        return 'Завершен'
      case 'pending':
        return 'В ожидании'
      default:
        return status
    }
  }

  return (
    <>
      {/* Overlay для мобильных */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 top-2 left-0 z-50 w-80
        lg:relative lg:translate-x-0 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        {/* Фон с размытием */}
        <div className="w-full h-full bg-white/95 backdrop-blur-xl border-r border-gray-200 rounded-r-2xl shadow-lg flex flex-col">
          {/* Заголовок */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 12h20M2 6h20M2 18h20" />
                    <rect x="4" y="4" width="4" height="4" rx="1" />
                    <rect x="4" y="10" width="4" height="4" rx="1" />
                    <rect x="4" y="16" width="4" height="4" rx="1" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Docker Compose
                </h2>
              </div>
              {/* Кнопка закрытия для мобильных */}
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Конструктор docker-compose файлов
            </p>
          </div>

          {/* Создание нового проекта */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <label className="text-sm font-medium text-gray-700">
                  Новый проект
                </label>
              </div>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Введите название конфигурации..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onKeyPress={(e) => e.key === 'Enter' && createNewProject()}
              />
              <button
                onClick={createNewProject}
                disabled={!newProjectName.trim()}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow hover:shadow-md transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>Создать конфигурацию</span>
              </button>
            </div>
          </div>

          {/* Список проектов */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <svg
                  className="w-4 h-4 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Конфигурации ({projectState.projects.length})
                </h3>
              </div>

              <div className="space-y-2">
                {projectState.projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => selectProject(project.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer group ${
                      project.id === projectState.currentId
                        ? 'bg-blue-50 border-blue-200 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div
                          className={`p-1.5 rounded ${
                            project.id === projectState.currentId
                              ? 'bg-blue-500'
                              : 'bg-gray-400 group-hover:bg-blue-400'
                          } transition-colors`}
                        >
                          <svg
                            className="w-3 h-3 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="2"
                              y="2"
                              width="20"
                              height="20"
                              rx="2.18"
                              ry="2.18"
                            />
                            <line x1="7" y1="2" x2="7" y2="22" />
                            <line x1="17" y1="2" x2="17" y2="22" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <line x1="2" y1="7" x2="7" y2="7" />
                            <line x1="2" y1="17" x2="7" y2="17" />
                            <line x1="17" y1="17" x2="22" y2="17" />
                            <line x1="17" y1="7" x2="22" y2="7" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {project.name}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(
                                project.status
                              )}`}
                            >
                              {getStatusText(project.status)}
                            </span>
                            {project.nodes && (
                              <span className="text-xs text-gray-500">
                                {project.nodes.length} нод
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteProject(project.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Компонент загрузки файлов */}
                <div className="mt-4">
                  <FileInput onFileConverted={handleFileConverted} />
                </div>
              </div>
            </div>
          </div>

          {/* Футер sidebar */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mb-1">
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Docker Compose Builder</span>
              </div>
              <div className="text-xs text-gray-400">v1.0.0</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
