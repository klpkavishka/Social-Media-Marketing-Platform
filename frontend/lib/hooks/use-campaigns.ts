import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { campaignsApi, CreateCampaignDto } from '@/lib/api/campaigns'
import { toast } from 'sonner'

export function useCampaigns(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['campaigns', params],
    queryFn: async () => {
      const response = await campaignsApi.getAll(params)
      return response.data
    },
  })
}

export function useCampaignById(id: string) {
  return useQuery({
    queryKey: ['campaigns', id],
    queryFn: async () => {
      const response = await campaignsApi.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCampaignAnalytics(id: string) {
  return useQuery({
    queryKey: ['campaigns', id, 'analytics'],
    queryFn: async () => {
      const response = await campaignsApi.getAnalytics(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCampaignContents(id: string) {
  return useQuery({
    queryKey: ['campaigns', id, 'contents'],
    queryFn: async () => {
      const response = await campaignsApi.getContents(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCampaignDto) => campaignsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast.success('Campaign created successfully!')
    },
    onError: () => {
      toast.error('Failed to create campaign')
    },
  })
}

export function useUpdateCampaign(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<CreateCampaignDto>) => campaignsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['campaigns', id] })
      toast.success('Campaign updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update campaign')
    },
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => campaignsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      toast.success('Campaign deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete campaign')
    },
  })
}

export function useAddContentToCampaign(campaignId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (contentId: string) => campaignsApi.addContent(campaignId, contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', campaignId] })
      queryClient.invalidateQueries({ queryKey: ['campaigns', campaignId, 'contents'] })
      toast.success('Content added to campaign!')
    },
    onError: () => {
      toast.error('Failed to add content')
    },
  })
}

export function useRemoveContentFromCampaign(campaignId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (contentId: string) => campaignsApi.removeContent(campaignId, contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', campaignId] })
      queryClient.invalidateQueries({ queryKey: ['campaigns', campaignId, 'contents'] })
      toast.success('Content removed from campaign!')
    },
    onError: () => {
      toast.error('Failed to remove content')
    },
  })
}
