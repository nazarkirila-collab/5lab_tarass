import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface Toast {
  id: number
  type: ToastType
  message: string
}

const MAX_TOASTS = 4

export const useToastStore = defineStore('toast', () => {
  const _toasts = ref<Toast[]>([])
  const timers = new Map<number, ReturnType<typeof setTimeout>>()
  let nextId = 1

  const toasts = computed(() => _toasts.value)

  function dismiss(id: number) {
    clearTimeout(timers.get(id))
    timers.delete(id)
    _toasts.value = _toasts.value.filter((toast) => toast.id !== id)
  }

  function show(type: ToastType, message: string, timeout = 4000) {
    // Не дублюємо однакове повідомлення, яке вже показане
    if (_toasts.value.some((toast) => toast.type === type && toast.message === message)) return

    const id = nextId++
    _toasts.value.push({ id, type, message })
    timers.set(id, setTimeout(() => dismiss(id), timeout))

    if (_toasts.value.length > MAX_TOASTS) dismiss(_toasts.value[0].id)
  }

  const success = (message: string) => show('success', message)
  const error = (message: string) => show('error', message)

  return { toasts, show, success, error, dismiss }
})
