"use client"

import { useEffect } from "react"
import { CheckCircle2, XCircle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "info"

export interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

export default function ToastComponent({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [toast.id, onClose])

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
  }

  const colors = {
    success: "bg-green-500 border-green-600",
    error: "bg-red-500 border-red-600",
    info: "bg-blue-500 border-blue-600",
  }

  const Icon = icons[toast.type]
  const colorClass = colors[toast.type]

  return (
    <div
      className={`
        ${colorClass}
        text-white rounded-lg shadow-lg p-4 mb-3
        flex items-center gap-3 min-w-[300px] max-w-md
        border-2
      `}
      style={{
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

