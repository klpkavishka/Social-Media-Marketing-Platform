export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'manager' | 'creator' | 'analyst'
  universityId: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface University {
  id: string
  name: string
  domain: string
  logoUrl?: string
  settings: Record<string, any>
  createdAt: string
}
