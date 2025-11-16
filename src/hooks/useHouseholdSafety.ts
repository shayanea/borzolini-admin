import { useState, useCallback } from 'react';
import { api } from '../services/api/core';
import type { 
  SafetySearchResponse, 
  ApiError 
} from '../types/household-safety';

export const useHouseholdSafety = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const searchSafetyItems = useCallback(async (
    query: string, 
    species?: string, 
    page = 1, 
    limit = 20
  ): Promise<SafetySearchResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
      });

      if (species && species !== 'all') {
        params.append('species', species);
      }

      const response = await api.get<SafetySearchResponse>(`/safety/search?${params.toString()}`);
      return response.data;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFoods = useCallback(async (
    species?: string, 
    page = 1, 
    limit = 20,
    search?: string,
    safetyLevel?: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC'
  ): Promise<SafetySearchResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (species && species !== 'all') {
        params.append('species', species);
      }
      if (search) {
        params.append('search', search);
      }
      if (safetyLevel) {
        params.append('safetyLevel', safetyLevel);
      }
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      if (sortOrder) {
        params.append('sortOrder', sortOrder);
      }

      const response = await api.get<{ foods: any[]; total: number; page: number; totalPages: number }>(`/safety/admin/foods?${params.toString()}`);
      return {
        data: response.data.foods.map(food => ({
          id: food.id,
          type: 'food' as const,
          name: food.canonical_name || food.name,
          category: food.category,
          safetyLevel: food.safety_overall,
          createdAt: food.created_at,
        })),
        total: response.data.total,
        page: response.data.page,
        limit,
      };
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPlants = useCallback(async (
    species?: string, 
    page = 1, 
    limit = 20,
    search?: string,
    toxicityLevel?: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC'
  ): Promise<SafetySearchResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (species && species !== 'all') {
        params.append('species', species);
      }
      if (search) {
        params.append('search', search);
      }
      if (toxicityLevel) {
        params.append('toxicityLevel', toxicityLevel);
      }
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      if (sortOrder) {
        params.append('sortOrder', sortOrder);
      }

      const response = await api.get<{ plants: any[]; total: number; page: number; totalPages: number }>(`/safety/admin/plants?${params.toString()}`);
      return {
        data: response.data.plants.map(plant => ({
          id: plant.id,
          type: 'plant' as const,
          name: plant.canonical_name || plant.name,
          category: plant.category,
          toxicityLevel: plant.toxicity_overall,
          createdAt: plant.created_at,
        })),
        total: response.data.total,
        page: response.data.page,
        limit,
      };
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHouseholdItems = useCallback(async (
    species?: string, 
    page = 1, 
    limit = 20,
    search?: string,
    severity?: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC'
  ): Promise<SafetySearchResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (species && species !== 'all') {
        params.append('species', species);
      }
      if (search) {
        params.append('search', search);
      }
      if (severity) {
        params.append('severity', severity);
      }
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      if (sortOrder) {
        params.append('sortOrder', sortOrder);
      }

      const response = await api.get<{ items: any[]; total: number; page: number; totalPages: number }>(`/safety/admin/items?${params.toString()}`);
      return {
        data: response.data.items.map(item => ({
          id: item.id,
          type: 'household' as const,
          name: item.canonical_name || item.name,
          category: item.category,
          hazardLevel: item.severity_overall,
          createdAt: item.created_at,
        })),
        total: response.data.total,
        page: response.data.page,
        limit,
      };
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchSafetyItems,
    getFoods,
    getPlants,
    getHouseholdItems,
    loading,
    error,
    clearError: () => setError(null),
  };
};
