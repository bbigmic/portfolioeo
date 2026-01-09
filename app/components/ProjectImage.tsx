"use client"

import { useState } from "react"
import Image from "next/image"
import { ExternalLink, Loader2 } from "lucide-react"

interface ProjectImageProps {
  image?: string | null
  screenshot?: string | null
  favicon?: string | null
  title?: string | null
  url: string
  className?: string
  height?: string
}

export default function ProjectImage({
  image,
  screenshot,
  favicon,
  title,
  url,
  className = "",
  height = "h-64",
}: ProjectImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Determine which image to show
  const finalImage = image || screenshot

  // Only show loading if we have an image to load
  const shouldShowLoading = isLoading && finalImage && !hasError

  return (
    <div className={`relative ${height} bg-gray-200 dark:bg-gray-700 overflow-hidden ${className}`}>
      {/* Loading Skeleton */}
      {shouldShowLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Ładowanie podglądu...</p>
          </div>
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      )}

      {/* Actual Image */}
      {finalImage && !hasError && (
        <Image
          src={finalImage}
          alt={title || "Project"}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          unoptimized
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
        />
      )}

      {/* Fallback: Favicon or Icon */}
      {(!finalImage || hasError) && (
        <div className="w-full h-full flex items-center justify-center">
          {favicon ? (
            <Image
              src={favicon}
              alt="Favicon"
              width={80}
              height={80}
              className="object-contain"
              unoptimized
            />
          ) : (
            <ExternalLink size={64} className="text-gray-400" />
          )}
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
    </div>
  )
}

