import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowsApi } from '@/lib/api/workflows';
import { CreateWorkflowDto, UpdateWorkflowDto } from '@/lib/types/workflow';
import { toast } from 'sonner';

const WORKFLOWS_QUERY_KEY = 'workflows';

// Get all workflows
export function useWorkflows(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: [WORKFLOWS_QUERY_KEY, params],
    queryFn: () => workflowsApi.getWorkflows(params),
  });
}

// Get single workflow
export function useWorkflow(id: string) {
  return useQuery({
    queryKey: [WORKFLOWS_QUERY_KEY, id],
    queryFn: () => workflowsApi.getWorkflow(id),
    enabled: !!id,
  });
}

// Create workflow
export function useCreateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkflowDto) => workflowsApi.createWorkflow(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY] });
      toast.success('Workflow created successfully');
    },
    onError: () => {
      toast.error('Failed to create workflow');
    },
  });
}

// Update workflow
export function useUpdateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkflowDto }) =>
      workflowsApi.updateWorkflow(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY, variables.id] });
      toast.success('Workflow updated successfully');
    },
    onError: () => {
      toast.error('Failed to update workflow');
    },
  });
}

// Delete workflow
export function useDeleteWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workflowsApi.deleteWorkflow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY] });
      toast.success('Workflow deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete workflow');
    },
  });
}

// Execute workflow
export function useExecuteWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workflowsApi.executeWorkflow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY] });
      toast.success('Workflow executed successfully');
    },
    onError: () => {
      toast.error('Failed to execute workflow');
    },
  });
}

// Activate workflow
export function useActivateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workflowsApi.activateWorkflow(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY, id] });
      toast.success('Workflow activated');
    },
    onError: () => {
      toast.error('Failed to activate workflow');
    },
  });
}

// Deactivate workflow
export function useDeactivateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workflowsApi.deactivateWorkflow(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [WORKFLOWS_QUERY_KEY, id] });
      toast.success('Workflow deactivated');
    },
    onError: () => {
      toast.error('Failed to deactivate workflow');
    },
  });
}
