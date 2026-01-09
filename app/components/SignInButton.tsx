"use client"

import { signIn } from "next-auth/react"

interface SignInButtonProps {
  variant?: "full" | "compact"
}

export default function SignInButton({ variant = "full" }: SignInButtonProps) {
  const isCompact = variant === "compact"
  
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className={`button ${isCompact ? "md:px-6 px-3" : ""}`}
      style={{
        "--provider-bg": "#fff",
        "--provider-dark-bg": "#fff",
        "--provider-color": "#000",
        "--provider-dark-color": "#000",
        "--provider-bg-hover": "rgba(255, 255, 255, 0.8)",
        "--provider-dark-bg-hover": "rgba(255, 255, 255, 0.8)",
      } as React.CSSProperties}
    >
      <img
        loading="lazy"
        height={24}
        width={24}
        id="provider-logo"
        src="https://authjs.dev/img/providers/google.svg"
        alt="Google"
        className="dark:hidden flex-shrink-0"
      />
      <img
        loading="lazy"
        height={24}
        width={24}
        id="provider-logo-dark"
        src="https://authjs.dev/img/providers/google.svg"
        alt="Google"
        className="hidden dark:block flex-shrink-0"
      />
      <span className={isCompact ? "hidden md:inline" : ""}>Sign in with Google</span>
    </button>
  )
}

