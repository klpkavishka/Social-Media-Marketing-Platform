import { apiClient } from './client';
import { Workflow, CreateWorkflowDto, UpdateWorkflowDto, WorkflowsResponse } from '@/lib/types/workflow';

export const workflowsApi = {
  // Get all workflows
  getWorkflows: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<WorkflowsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);

    const response = await apiClient.get<WorkflowsResponse>(`/workflows?${searchParams.toString()}`);
    return response.data;
  },

  // Get single workflow
  getWorkflow: async (id: string): Promise<Workflow> => {
    const response = await apiClient.get<Workflow>(`/workflows/${id}`);
    return response.data;
  },

  // Create workflow
  createWorkflow: async (data: CreateWorkflowDto): Promise<Workflow> => {
    const response = await apiClient.post<Workflow>('/workflows', data);
    return response.data;
  },

  // Update workflow
  updateWorkflow: async (id: string, data: UpdateWorkflowDto): Promise<Workflow> => {
    const response = await apiClient.patch<Workflow>(`/workflows/${id}`, data);
    return response.data;
  },

  // Delete workflow
  deleteWorkflow: async (id: string): Promise<void> => {
    await apiClient.delete(`/workflows/${id}`);
  },

  // Execute workflow
  executeWorkflow: async (id: string): Promise<unknown> => {
    const response = await apiClient.post<unknown>(`/workflows/${id}/execute`);
    return response.data;
  },

  // Activate workflow
  activateWorkflow: async (id: string): Promise<Workflow> => {
    const response = await apiClient.patch<Workflow>(`/workflows/${id}/activate`);
    return response.data;
  },

  // Deactivate workflow
  deactivateWorkflow: async (id: string): Promise<Workflow> => {
    const response = await apiClient.patch<Workflow>(`/workflows/${id}/deactivate`);
    return response.data;
  },
};
