import axios from 'axios'
import { apiClient } from './client'
import { useToastStore } from '../stores/toast.store'

const DEFAULT_MESSAGES: Record<number, string> = {
  400: 'Некоректний запит',
  404: 'Ресурс не знайдено',
  413: 'Запит занадто великий',
  500: 'Внутрішня помилка сервера'
}

function getMessage(data: unknown): string | null {
  if (typeof data !== 'object' || data === null) return null
  const { message } = data as { message?: unknown }
  return typeof message === 'string' && message ? message : null
}

export function setupInterceptors(): void {
  // Response Interceptor: єдина точка, де помилки сервера перетворюються на toast-повідомлення
  apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      const toast = useToastStore()

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const { status, data } = error.response
          const text = getMessage(data) ?? DEFAULT_MESSAGES[status] ?? `Помилка сервера (${status})`
          toast.show(status === 404 ? 'warning' : 'error', text)
        } else if (error.code === 'ECONNABORTED') {
          toast.show('error', 'Сервер не відповів вчасно')
        } else {
          toast.show('error', "Немає зв'язку із сервером")
        }
      }

      return Promise.reject(error)
    }
  )
}
