import { useUnit } from "effector-react";
import React, { useState } from "react";
import { IProject } from "store/project";
import { $project, addNewProject, deleteProject, selectProject } from "store/project/project.store";

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const projectState = useUnit($project);

  const [newProjectName, setNewProjectName] = useState("");

  const createNewProject = () => {
    if (newProjectName.trim()) {
      const newProject: IProject = {
        id: String(Date.now()),
        name: newProjectName.trim(),
        status: "active",
      };
      addNewProject(newProject);
      setNewProjectName("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Активный";
      case "completed":
        return "Завершен";
      case "pending":
        return "В ожидании";
      default:
        return status;
    }
  };

  return (
    <>
      {/* Overlay для мобильных */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 top-2 left-0 z-50 w-80
        lg:relative lg:translate-x-0 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Фон с размытием */}
        <div className="w-full h-full bg-white/90 backdrop-blur-xl border-r border-gray-200/50 rounded-r-3xl shadow-xl flex flex-col">
          {/* Заголовок */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Мои проекты</h2>
              {/* Кнопка закрытия для мобильных */}
              <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100/50 transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Создание нового проекта */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Название проекта..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && createNewProject()}
              />
              <button
                onClick={createNewProject}
                disabled={!newProjectName.trim()}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
              >
                + Создать проект
              </button>
            </div>
          </div>

          {/* Список проектов */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Все проекты ({projectState.projects.length})
              </h3>

              <div className="space-y-2">
                {projectState.projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => selectProject(project.id)}
                    className={`p-3 rounded-lg ${project.id === projectState.currentId ? 'bg-blue-500 hover:bg-blue-400' : 'hover:border-gray-200/50'} cursor-pointer transition-colors border border-transparent`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 ${project.id === projectState.currentId ? 'bg-white' : 'bg-blue-500'} rounded-full`}></div>
                        <span className="text-sm font-medium text-gray-900">{project.name}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                      <button onClick={() => deleteProject(project.id)} className="cursor-pointer">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          stroke-width="0"
                          viewBox="0 0 448 512"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Футер sidebar */}
          <div className="p-4 border-t border-gray-200/50">
            <div className="text-center text-xs text-gray-500">© 2024 NovaSphere</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
