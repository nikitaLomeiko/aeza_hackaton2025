import { ConfigForm } from 'components/forms/config-form'
import { DeployForm } from 'components/forms/deploy-form'
import { DownloadForm } from 'components/forms/download-form'
import { NetworkForm } from 'components/forms/network-form'
import { SecretForm } from 'components/forms/secret-form'
import { ServiceForm } from 'components/forms/service-form'
import { VolumeForm } from 'components/forms/volume-form/volume.form'
import { Modal } from 'components/ui/modal'
import { Portal } from 'components/ui/portal'
import { useUnit } from 'effector-react'
import { useState } from 'react'
import { $project } from 'store/project'
import { convertReactFlowToDockerCompose } from 'store/project/utils/convertReactFlowToDockerCompose'

export const Toolbar = () => {
  const tools = [
    {
      id: 1,
      name: 'service',
      label: 'Service',
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      name: 'network',
      label: 'Network',
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="8" y1="10" x2="16" y2="10" />
          <line x1="8" y1="18" x2="16" y2="18" />
          <line x1="12" y1="6" x2="12" y2="10" />
          <line x1="12" y1="14" x2="12" y2="18" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
    },
    {
      id: 3,
      name: 'volume',
      label: 'Volume',
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 4,
      name: 'secret',
      label: 'Secret',
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" />
        </svg>
      ),
      color: 'from-red-500 to-red-600',
    },
    {
      id: 5,
      name: 'config',
      label: 'Config',
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 6,
      name: 'download',
      label: 'Export YAML',
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      id: 7,
      name: 'deploy',
      label: 'Deploy',
      icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 1024 1024"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M811.4 418.7C765.6 297.9 648.9 212 512.2 212S258.8 297.8 213 418.6C127.3 441.1 64 519.1 64 612c0 110.5 89.5 200 199.9 200h496.2C870.5 812 960 722.5 960 612c0-92.7-63.1-170.7-148.6-193.3z"></path>
        </svg>
      ),
      color: 'from-emerald-500 to-emerald-600',
    },
  ]

  const [openModal, setOpenModal] = useState(false)
  const [typeForm, setTypeForm] = useState('')
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const projectState = useUnit($project)

  const currentProject = projectState.projects.find(
    (item) => item.id === projectState.currentId
  )

  const handleToolClick = (toolName: string) => {
    setOpenModal(true)
    setTypeForm(toolName)
  }

  const handleMouseEnter = (toolName: string) => {
    setActiveTool(toolName)
  }

  const handleMouseLeave = () => {
    setActiveTool(null)
  }

  return (
    <>
      <div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`
          bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/60 
          shadow-2xl shadow-black/10 px-2 py-2 transition-all duration-300
          ${isHovered ? 'shadow-2xl shadow-black/20 scale-105' : 'shadow-lg'}
          hover:shadow-2xl hover:shadow-black/20 hover:scale-105
        `}
        >
          <div className="flex items-center space-x-1">
            {tools.map((tool) => (
              <div key={tool.id} className="relative">
                <button
                  onClick={() => handleToolClick(tool.name)}
                  onMouseEnter={() => handleMouseEnter(tool.name)}
                  onMouseLeave={handleMouseLeave}
                  className={`
                    p-3 rounded-xl transition-all duration-300 group relative
                    ${
                      activeTool === tool.name
                        ? `bg-gradient-to-r ${tool.color} text-white shadow-lg transform scale-110`
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                    }
                  `}
                  title={tool.label}
                >
                  {tool.icon}

                  {/* Анимированная подсказка */}
                  <div
                    className={`
                    absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3
                    px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg
                    whitespace-nowrap pointer-events-none
                    transition-all duration-200 ease-out shadow-lg
                    ${
                      activeTool === tool.name
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-2 scale-95'
                    }
                  `}
                  >
                    {tool.label}
                    {/* Стрелочка */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>

                  {/* Активный индикатор */}
                  {activeTool === tool.name && (
                    <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
                  )}
                </button>

                {/* Разделитель между кнопками (кроме последней) */}
                {tool.id !== tools.length && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-6 bg-gray-200/60" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Фоновая подсветка при ховере */}
        <div
          className={`
          absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 
          rounded-2xl blur-xl transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
        />
      </div>

      <Portal>
        <Modal isOpen={openModal} onClose={() => setOpenModal(false)} size="lg">
          {typeForm === 'service' && (
            <ServiceForm onCancel={() => setOpenModal(false)} />
          )}
          {typeForm === 'volume' && (
            <VolumeForm onCancel={() => setOpenModal(false)} />
          )}
          {typeForm === 'network' && (
            <NetworkForm onCancel={() => setOpenModal(false)} />
          )}
          {typeForm === 'secret' && (
            <SecretForm onCancel={() => setOpenModal(false)} />
          )}
          {typeForm === 'config' && (
            <ConfigForm onCancel={() => setOpenModal(false)} />
          )}
          {typeForm === 'deploy' && (
            <DeployForm
              dockerConfig={convertReactFlowToDockerCompose({
                edges: currentProject?.edges || [],
                nodes: currentProject?.nodes || [],
                name: 'docker-compose.yaml',
              })}
              onCancel={() => setOpenModal(false)}
            />
          )}
          {typeForm === 'download' && (
            <DownloadForm
              initialData={{
                code: convertReactFlowToDockerCompose({
                  edges: currentProject?.edges || [],
                  nodes: currentProject?.nodes || [],
                  name: 'docker-compose.yaml',
                }),
              }}
              onCancel={() => setOpenModal(false)}
            />
          )}
        </Modal>
      </Portal>
    </>
  )
}
