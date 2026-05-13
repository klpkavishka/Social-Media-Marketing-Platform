'use client'

import React from 'react'

interface LogoProps {
  width?: number
  height?: number
  showName?: boolean
  className?: string
}

export function Logo({ width = 40, height = 40, showName = true, className = '' }: LogoProps) {
  const widthClass = width <= 24 ? 'w-6' : width <= 32 ? 'w-8' : width <= 40 ? 'w-10' : 'w-12'
  const heightClass = height <= 24 ? 'h-6' : height <= 32 ? 'h-8' : height <= 40 ? 'h-10' : 'h-12'
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${widthClass} ${heightClass} flex-shrink-0`}>
        {/* Modern geometric logo with gradient */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="logoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="logoGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle cx="20" cy="20" r="19" fill="url(#logoGradient1)" opacity="0.1" stroke="url(#logoGradient1)" strokeWidth="0.5" />

          {/* Main geometric shape - intertwined paths */}
          <path
            d="M 10 12 Q 15 8 20 10 T 30 12 L 28 18 Q 23 22 20 20 T 12 18 Z"
            fill="url(#logoGradient1)"
          />
          <path
            d="M 12 22 Q 17 18 20 20 T 28 28 L 26 30 Q 21 28 18 30 T 12 28 Z"
            fill="url(#logoGradient2)"
          />

          {/* Center accent - represents connectivity/network */}
          <circle cx="20" cy="20" r="2" fill="white" />
          <circle cx="20" cy="20" r="4" fill="none" stroke="url(#logoGradient1)" strokeWidth="0.5" opacity="0.6" />
        </svg>
      </div>

      {showName && (
        <div className="flex flex-col">
          <div className="text-lg font-bold bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            ArcFlow
          </div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Social Hub
          </div>
        </div>
      )}
    </div>
  )
}

export function LogoMark() {
  return <Logo showName={false} />
}
