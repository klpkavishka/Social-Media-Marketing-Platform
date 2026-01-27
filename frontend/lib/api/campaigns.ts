import { apiClient } from './client'

export interface Campaign {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'completed'
  startDate: string
  endDate: string
  budget?: number
  platforms: string[]
  createdAt: string
}

export interface CreateCampaignDto {
  name: string
  description: string
  startDate: string
  endDate: string
  platforms: string[]
  budget?: number
}

export const campaignsApi = {
  getAll: () => apiClient.get<Campaign[]>('/campaigns'),

  getById: (id: string) => apiClient.get<Campaign>(`/campaigns/${id}`),

  create: (data: CreateCampaignDto) => apiClient.post<Campaign>('/campaigns', data),

  update: (id: string, data: Partial<CreateCampaignDto>) =>
    apiClient.patch<Campaign>(`/campaigns/${id}`, data),

  delete: (id: string) => apiClient.delete(`/campaigns/${id}`),
}
