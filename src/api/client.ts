import { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { type IClient } from './model/types'
import { BASE_API } from './model'

export const ApiClient = async <T>(
  { url, method = 'GET', data, params, headers }: IClient,
  scheme: AxiosInstance = BASE_API
): Promise<{ data: T; status: number; total: number | string }> => {
  const requestParams: AxiosRequestConfig = {
    method,
    url,
    params,
    data,
  }

  scheme.defaults.headers = { ...scheme.defaults.headers, ...headers }

  return scheme(requestParams)
    .then((res) => ({
      data: res.data as T,
      status: res.status,
      total: res.headers['x-total-count'],
    }))
    .catch((err) => {
      console.error(
        '\nERROR MESSAGE:',
        err.response?.data.message,
        `\nSTATUS: ${err.response?.data.status}`
      )

      return {
        data: 'isError' as unknown as T,
        status: err.response?.status,
        total: '0',
      }
    })
}
