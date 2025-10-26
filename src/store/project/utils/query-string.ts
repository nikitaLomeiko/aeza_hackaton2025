/**
 * Получение параметра из query string
 */
export const getQueryParam = (param: string): string | null => {
  if (typeof window === 'undefined') return null

  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

/**
 * Получение всех параметров из query string в виде объекта
 */
export const getAllQueryParams = (): Record<string, string> => {
  if (typeof window === 'undefined') return {}

  const urlParams = new URLSearchParams(window.location.search)
  const params: Record<string, string> = {}

  urlParams.forEach((value, key) => {
    params[key] = value
  })

  return params
}

/**
 * Удаление query параметров из URL без перезагрузки страницы
 */
export const removeQueryParams = (paramsToRemove: string[] = []): void => {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  const searchParams = url.searchParams

  if (paramsToRemove.length === 0) {
    // Удаляем все параметры
    url.search = ''
  } else {
    // Удаляем только указанные параметры
    paramsToRemove.forEach((param) => {
      searchParams.delete(param)
    })
    url.search = searchParams.toString()
  }

  // Обновляем URL без перезагрузки страницы
  window.history.replaceState({}, '', url.toString())
}

/**
 * Проверка наличия параметра в query string
 */
export const hasQueryParam = (param: string): boolean => {
  return getQueryParam(param) !== null
}
