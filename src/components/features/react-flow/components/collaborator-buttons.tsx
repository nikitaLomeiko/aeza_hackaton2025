import { ApiClient } from 'api/client'
import { useUnit } from 'effector-react'
import React, { useState } from 'react'
import { $project, IProject, updateProject } from 'store/project'

interface GitActionsProps {
  projectId: string
  disabled?: boolean
}

export const CollaboratorButtons: React.FC<GitActionsProps> = ({
  projectId,
  disabled = false,
}) => {
  const projectState = useUnit($project)
  const [isPushing, setIsPushing] = useState(false)
  const [isPulling, setIsPulling] = useState(false)

  const currentProject = projectState.projects.find(
    (item) => item.id === projectState.currentId
  )

  const handlePush = async () => {
    setIsPushing(true)
    try {
      const { data } = await ApiClient({
        url: `${projectId}`,
        method: 'PUT',
        data: currentProject,
      })
    } catch (error) {
      console.error('Push failed:', error)
    } finally {
      setIsPushing(false)
    }
  }

  const handlePull = async () => {
    setIsPulling(true)
    try {
      const { data } = await ApiClient({
        url: `${projectId}`,
      })

      updateProject(data as IProject)
    } catch (error) {
      console.error('Pull failed:', error)
    } finally {
      setIsPulling(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {projectId}
          </span>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex gap-2">
        {/* Кнопка Pull */}
        <button
          onClick={handlePull}
          disabled={disabled || isPulling || isPushing}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isPulling ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Получение...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Pull
            </>
          )}
        </button>

        {/* Кнопка Push */}
        <div className="flex-1 flex flex-col gap-1">
          <button
            onClick={handlePush}
            disabled={disabled || isPushing || isPulling}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isPushing ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Отправка...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                Push
              </>
            )}
          </button>

          {/* Кнопка переключения поля коммита */}
          {/* <button
            onClick={toggleCommitInput}
            disabled={disabled || isPushing}
            className="w-full text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 transition-colors duration-200"
          >
            {showCommitInput ? 'Отменить коммит' : 'Добавить коммит'}
          </button> */}
        </div>
      </div>

      {/* Статус */}
      {(isPushing || isPulling) && (
        <div className="text-xs text-gray-500 text-center">
          {isPushing && 'Отправка изменений на сервер...'}
          {isPulling && 'Получение изменений с сервера...'}
        </div>
      )}
    </div>
  )
}
