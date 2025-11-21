import { useCallback, useState } from 'react';

import { api } from '../services/api/core';
import type {
  ApiError,
  SafetySearchResponse,
  SafetySearchResult,
} from '../types/household-safety';

interface RawSafetyRecord {
  id: string;
  canonical_name?: string | null;
  name?: string | null;
  category?: string | null;
  scientific_name?: string | null;
  safety_overall?: string | null;
  safetyLevel?: string | null;
  toxicity_overall?: string | null;
  toxicityLevel?: string | null;
  hazard_overall?: string | null;
  hazardLevel?: string | null;
  severity_overall?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface MixedSafetySearchResponse {
  foods?: RawSafetyRecord[];
  plants?: RawSafetyRecord[];
  items?: RawSafetyRecord[];
  total?: number;
  page?: number;
  limit?: number;
}

interface FoodsApiResponse {
  foods: RawSafetyRecord[];
  total: number;
  page: number;
  totalPages: number;
}

interface PlantsApiResponse {
  plants: RawSafetyRecord[];
  total: number;
  page: number;
  totalPages: number;
}

interface ItemsApiResponse {
  items: RawSafetyRecord[];
  total: number;
  page: number;
  totalPages: number;
}

const toDate = (value?: string | null): Date => {
  if (value) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date();
};

const mapRawRecord = (record: RawSafetyRecord, type: SafetySearchResult['type']): SafetySearchResult => ({
  id: record.id,
  type,
  name: record.canonical_name ?? record.name ?? 'Unknown item',
  category: record.category ?? (type === 'plant' ? record.scientific_name ?? undefined : record.category ?? undefined),
  safetyLevel:
    type === 'food'
      ? record.safety_overall ?? record.safetyLevel ?? undefined
      : record.safetyLevel ?? undefined,
  hazardLevel:
    type === 'household'
      ? record.hazard_overall ?? record.severity_overall ?? record.hazardLevel ?? undefined
      : record.hazardLevel ?? undefined,
  toxicityLevel:
    type === 'plant'
      ? record.toxicity_overall ?? record.toxicityLevel ?? undefined
      : record.toxicityLevel ?? undefined,
  createdAt: toDate(record.created_at ?? record.updated_at),
});

const isStandardSearchResponse = (
  payload: SafetySearchResponse | MixedSafetySearchResponse
): payload is SafetySearchResponse => Array.isArray((payload as SafetySearchResponse).data);

const normalizeSearchResponse = (
  payload: SafetySearchResponse | MixedSafetySearchResponse
): SafetySearchResponse => {
  if (isStandardSearchResponse(payload)) {
    return payload;
  }

  const foods = payload.foods ?? [];
  const plants = payload.plants ?? [];
  const items = payload.items ?? [];

  const combined: SafetySearchResult[] = [
    ...foods.map(food => mapRawRecord(food, 'food')),
    ...plants.map(plant => mapRawRecord(plant, 'plant')),
    ...items.map(item => mapRawRecord(item, 'household')),
  ];

  return {
    data: combined,
    total: payload.total ?? combined.length,
    page: payload.page ?? 1,
    limit: payload.limit ?? Math.max(combined.length, 1),
  };
};

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

      const response = await api.get<SafetySearchResponse | MixedSafetySearchResponse>(
        `/safety/search?${params.toString()}`
      );
      return normalizeSearchResponse(response.data);
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

      const response = await api.get<FoodsApiResponse>(`/safety/admin/foods?${params.toString()}`);
      return {
        data: response.data.foods.map(food => mapRawRecord(food, 'food')),
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

      const response = await api.get<PlantsApiResponse>(`/safety/admin/plants?${params.toString()}`);
      return {
        data: response.data.plants.map(plant => mapRawRecord(plant, 'plant')),
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

      const response = await api.get<ItemsApiResponse>(`/safety/admin/items?${params.toString()}`);
      return {
        data: response.data.items.map(item => mapRawRecord(item, 'household')),
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
