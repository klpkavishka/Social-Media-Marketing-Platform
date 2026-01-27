import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contentApi, CreateContentDto } from '@/lib/api/content'
import { toast } from 'sonner'

export function useContent(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['content', params],
    queryFn: () => contentApi.getAll(params),
  })
}

export function useContentById(id: string) {
  return useQuery({
    queryKey: ['content', id],
    queryFn: () => contentApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateContentDto) => contentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
      toast.success('Content created successfully!')
    },
    onError: () => {
      toast.error('Failed to create content')
    },
  })
}

export function useUpdateContent(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<CreateContentDto>) => contentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
      queryClient.invalidateQueries({ queryKey: ['content', id] })
      toast.success('Content updated successfully!')
    },
    onError: () => {
      toast.error('Failed to update content')
    },
  })
}

export function useDeleteContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => contentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] })
      toast.success('Content deleted successfully!')
    },
    onError: () => {
      toast.error('Failed to delete content')
    },
  })
}

export function useGenerateCaption() {
  return useMutation({
    mutationFn: (params: { topic?: string; tone?: string; platform?: string }) =>
      contentApi.generateCaption(params),
    onSuccess: () => {
      toast.success('Caption generated successfully!')
    },
    onError: () => {
      toast.error('Failed to generate caption')
    },
  })
}
