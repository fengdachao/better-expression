'use client'

import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

export interface UseToastReturn {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => void
  dismiss: (toastId: string) => void
  dismissAll: () => void
}

let toastCount = 0

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastCount}`
    const duration = toastData.duration ?? 5000

    const newToast: Toast = {
      ...toastData,
      id
    }

    setToasts(prev => [...prev, newToast])

    // Auto dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }
  }, [])

  const dismiss = useCallback((toastId: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    toast,
    dismiss,
    dismissAll
  }
}
