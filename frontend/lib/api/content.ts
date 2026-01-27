import { apiClient } from './client'

export interface Content {
  id: string
  caption: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduledAt?: string
  publishedAt?: string
  platforms: string[]
  mediaUrls: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateContentDto {
  caption: string
  platforms: string[]
  mediaUrls?: string[]
  scheduledAt?: string
}

export const contentApi = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<{ data: Content[]; total: number }>('/content', params),

  getById: (id: string) => apiClient.get<Content>(`/content/${id}`),

  create: (data: CreateContentDto) => apiClient.post<Content>('/content', data),

  update: (id: string, data: Partial<CreateContentDto>) =>
    apiClient.patch<Content>(`/content/${id}`, data),

  delete: (id: string) => apiClient.delete(`/content/${id}`),

  publish: (id: string) => apiClient.post<Content>(`/content/${id}/publish`),

  generateCaption: (params: { topic?: string; tone?: string; platform?: string }) =>
    apiClient.post<{ caption: string; hashtags: string[] }>('/content/generate-caption', params),
}
