import type {
  AllBreedsResponse,
  ApiError,
  Breed,
  CreateBreedDto,
  UpdateBreedDto,
} from '@/types/breeds';
import { useCallback, useState } from 'react';

import { api } from '@/services/api/core';

export const useBreeds = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const createBreed = useCallback(async (data: CreateBreedDto): Promise<Breed | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Breed>('/breeds', data);
      return response.data;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBreeds = useCallback(async (): Promise<AllBreedsResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<AllBreedsResponse>('/breeds');
      return response.data;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBreed = useCallback(async (id: string): Promise<Breed | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Breed>(`/breeds/${id}`);
      return response.data;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBreed = useCallback(
    async (id: string, data: UpdateBreedDto): Promise<Breed | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.patch<Breed>(`/breeds/${id}`, data);
        return response.data;
      } catch (err) {
        setError(err as ApiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteBreed = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/breeds/${id}`);
      return true;
    } catch (err) {
      setError(err as ApiError);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDeleteBreeds = useCallback(async (ids: string[]): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Delete breeds one by one since API doesn't have bulk delete
      await Promise.all(ids.map(id => api.delete(`/breeds/${id}`)));
      return true;
    } catch (err) {
      setError(err as ApiError);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createBreed,
    getBreeds,
    getBreed,
    updateBreed,
    deleteBreed,
    bulkDeleteBreeds,
    loading,
    error,
    clearError: () => setError(null),
  };
};
