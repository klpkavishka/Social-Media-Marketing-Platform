'use client'

import React from 'react'

export function GradientOrb({ 
  className = '', 
  position = 'top-right' 
}: { 
  className?: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
}) {
  const positionClasses = {
    'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }

  return (
    <div
      className={`absolute w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none ${positionClasses[position]} ${className}`}
    />
  )
}

export function BackgroundPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <GradientOrb position="top-left" className="bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
      <GradientOrb position="bottom-right" className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500" />
      
      {/* Grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Diagonal lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-3"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="diagonal" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="60" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal)" />
      </svg>
    </div>
  )
}

export function FeatureGradientBg({ index }: { index: number }) {
  const gradients = [
    'from-violet-500/10 to-blue-500/10',
    'from-blue-500/10 to-cyan-500/10',
    'from-cyan-500/10 to-teal-500/10',
    'from-purple-500/10 to-pink-500/10',
    'from-pink-500/10 to-orange-500/10',
    'from-orange-500/10 to-yellow-500/10',
  ]

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
  )
}

export function PremiumCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group rounded-lg border border-transparent bg-gradient-to-b from-background to-muted/50 overflow-hidden transition-all hover:border-primary/20 ${className}`}>
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-lg p-px bg-gradient-to-r from-violet-500/50 via-blue-500/50 to-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-px rounded-lg bg-background" />
      
      {/* Content */}
      <div className="relative p-6 z-10">{children}</div>
    </div>
  )
}
