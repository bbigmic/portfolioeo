"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { AlertTriangle, X } from "lucide-react"

interface ConfirmDialogContextType {
  confirm: (message: string) => Promise<boolean>
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined)

export function useConfirm() {
  const context = useContext(ConfirmDialogContext)
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmDialogProvider")
  }
  return context
}

interface ConfirmDialogProps {
  children: ReactNode
}

export function ConfirmDialogProvider({ children }: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback((msg: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setMessage(msg)
      setIsOpen(true)
      setResolvePromise(() => resolve)
    })
  }, [])

  const handleConfirm = () => {
    if (resolvePromise) {
      resolvePromise(true)
      setResolvePromise(null)
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    if (resolvePromise) {
      resolvePromise(false)
      setResolvePromise(null)
    }
    setIsOpen(false)
  }

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 border-2 border-gray-200 dark:border-gray-700"
            style={{
              animation: 'zoomIn 0.2s ease-out'
            }}
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Potwierdź akcję
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{message}</p>
                </div>
                <button
                  onClick={handleCancel}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  Potwierdź
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  )
}

