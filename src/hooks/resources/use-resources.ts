import { useState, useCallback } from 'react';
import { api } from '@/services/api/core';
import type { 
  Resource, 
  CreateResourceDto, 
  UpdateResourceDto, 
  ResourcesResponse,
  ApiError
} from '@/types/resources';

export const useResources = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createResource = useCallback(async (data: CreateResourceDto): Promise<Resource | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Resource>('/resources', data);
      return response.data;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getResources = useCallback(async (
    page = 1, 
    limit = 10, 
    type?: string, 
    isActive?: boolean
  ): Promise<ResourcesResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      
      if (type) params.append('type', type);
      if (isActive !== undefined) params.append('isActive', isActive.toString());

      const response = await api.get<Resource[]>(`/resources?${params.toString()}`);
      // API returns array directly, not wrapped
      return {
        data: response.data,
        total: response.data.length,
        page,
        limit,
      };
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getResource = useCallback(async (id: string): Promise<Resource | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Resource>(`/resources/${id}`);
      return response.data;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateResource = useCallback(async (id: string, data: UpdateResourceDto): Promise<Resource | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<Resource>(`/resources/${id}`, data);
      return response.data;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteResource = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/resources/${id}`);
      return true;
    } catch (err) {
      setError(err as ApiError);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDeleteResources = useCallback(async (ids: string[]): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Delete resources one by one since API doesn't have bulk delete
      await Promise.all(ids.map(id => api.delete(`/resources/${id}`)));
      return true;
    } catch (err) {
      setError(err as ApiError);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createResource,
    getResources,
    getResource,
    updateResource,
    deleteResource,
    bulkDeleteResources,
    loading,
    error,
    clearError: () => setError(null),
  };
};
