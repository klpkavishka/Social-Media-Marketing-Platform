export interface Content {
  id: string
  caption: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduledAt?: string
  publishedAt?: string
  platforms: Platform[]
  mediaUrls: string[]
  createdBy: string
  organizationId: string
  createdAt: string
  updatedAt: string
}

export type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube'

export interface ContentVersion {
  id: string
  contentId: string
  caption: string
  mediaUrls: string[]
  version: number
  createdAt: string
}
