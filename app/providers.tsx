"use client"

import { SessionProvider } from "next-auth/react"
import { ToastProvider } from "./components/ToastContainer"
import { ConfirmDialogProvider } from "./components/ConfirmDialog"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <ConfirmDialogProvider>
          {children}
        </ConfirmDialogProvider>
      </ToastProvider>
    </SessionProvider>
  )
}

