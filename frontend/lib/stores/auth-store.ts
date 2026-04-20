'use client'

import { create } from 'zustand'

// Simplified auth store for Auth0
// Auth0 SDK handles session management via HTTP-only cookies
// This store is kept for any UI-specific state that components might rely on
interface AuthState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
