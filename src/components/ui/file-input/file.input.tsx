import React, { useCallback, useState } from 'react'
// @ts-ignore
import yaml from 'js-yaml'

interface YamlFileConverterProps {
  onFileConverted?: (jsonData: any, fileName: string) => void
}

export const FileInput: React.FC<YamlFileConverterProps> = ({
  onFileConverted,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [convertedData, setConvertedData] = useState<any>(null)
  const [fileName, setFileName] = useState<string>('')

  const processFile = useCallback(
    (file: File) => {
      // Проверяем расширение файла
      const allowedExtensions = ['.yml', '.yaml']
      const fileExtension = file.name
        .toLowerCase()
        .slice(file.name.lastIndexOf('.'))

      if (!allowedExtensions.includes(fileExtension)) {
        setError('Пожалуйста, выберите файл с расширением .yml или .yaml')
        return
      }

      setIsLoading(true)
      setError(null)
      setFileName(file.name)

      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const yamlContent = e.target?.result as string
          const jsonData = yaml.load(yamlContent)

          onFileConverted?.(jsonData, file.name)
        } catch (err: any) {
          setError(`Ошибка парсинга YAML: ${err.message}`)
        } finally {
          setIsLoading(false)
        }
      }

      reader.onerror = () => {
        setError('Ошибка чтения файла')
        setIsLoading(false)
      }

      reader.readAsText(file)
    },
    [onFileConverted]
  )

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleClear = () => {
    setConvertedData(null)
    setFileName('')
    setError(null)
  }

  const copyToClipboard = async () => {
    if (convertedData) {
      try {
        await navigator.clipboard.writeText(
          JSON.stringify(convertedData, null, 2)
        )
        alert('JSON скопирован в буфер обмена!')
      } catch (err) {
        console.error('Ошибка копирования:', err)
      }
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      {/* Область загрузки файла */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('yaml-file-input')?.click()}
      >
        <input
          id="yaml-file-input"
          type="file"
          accept=".yml,.yaml"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-3">
          <div className="text-gray-400">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900">
              {isLoading ? 'Загрузка...' : 'Загрузите Docker Compose файл'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Перетащите файл сюда или нажмите для выбора
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Поддерживаются файлы .yml и .yaml
            </p>
          </div>
        </div>
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Результат конвертации */}
      {convertedData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Конвертированный JSON
              </h3>
              <p className="text-sm text-gray-500">Файл: {fileName}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Копировать JSON
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Очистить
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <pre className="text-green-400 text-sm overflow-auto max-h-96">
              {JSON.stringify(convertedData, null, 2)}
            </pre>
          </div>

          {/* Информация о структуре Docker Compose */}
          {convertedData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                Структура Docker Compose:
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                {convertedData.version && (
                  <p>• Version: {convertedData.version}</p>
                )}
                {convertedData.services && (
                  <p>
                    • Services: {Object.keys(convertedData.services).length}
                  </p>
                )}
                {convertedData.networks && (
                  <p>
                    • Networks: {Object.keys(convertedData.networks).length}
                  </p>
                )}
                {convertedData.volumes && (
                  <p>• Volumes: {Object.keys(convertedData.volumes).length}</p>
                )}
                {convertedData.configs && (
                  <p>• Configs: {Object.keys(convertedData.configs).length}</p>
                )}
                {convertedData.secrets && (
                  <p>• Secrets: {Object.keys(convertedData.secrets).length}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Индикатор загрузки */}
      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  )
}
