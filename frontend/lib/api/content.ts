import { apiClient } from './client'

export interface Content {
  id: string
  title: string
  body: string
  type: 'post' | 'story' | 'reel' | 'video' | 'image'
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  media?: Record<string, unknown>
  platforms: string[]
  scheduledDate?: string
  publishedDate?: string
  aiSuggestions?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CreateContentDto {
  title: string
  body: string
  type: 'post' | 'story' | 'reel' | 'video' | 'image'
  status?: 'draft' | 'scheduled' | 'published' | 'failed'
  media?: Record<string, unknown>
  platforms?: string[]
  scheduledDate?: string
  aiSuggestions?: Record<string, unknown>
}

export const contentApi = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<{ data: Content[]; total: number }>('/content', params),

  getById: (id: string) => apiClient.get<Content>(`/content/${id}`),

  getCalendar: (params: { startDate: string; endDate: string }) =>
    apiClient.get<{ data: Content[] }>('/content/calendar', params),

  create: (data: CreateContentDto) => apiClient.post<Content>('/content', data),

  update: (id: string, data: Partial<CreateContentDto>) =>
    apiClient.patch<Content>(`/content/${id}`, data),

  delete: (id: string) => apiClient.delete(`/content/${id}`),

  publish: (id: string) => apiClient.post<Content>(`/content/${id}/publish`),

  generateCaption: (params: { topic?: string; tone?: string; platform?: string }) =>
    apiClient.post<{ caption: string; hashtags: string[] }>('/content/generate-caption', params),
}
