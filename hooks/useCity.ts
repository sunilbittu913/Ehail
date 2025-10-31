/**
 * City Master API Hooks
 * React hooks for managing city data
 */

import { useQuery, useMutation } from './useBaseHooks';
import { apiClient } from './apiClient';
import {
  CityMasterDTO,
  ApiResponse,
  ListQueryParams,
  PagedData,
  UseQueryResult,
  UseMutationState,
} from './types';

/**
 * Hook to fetch a single city by ID
 * @param id - City ID
 * @param options - Hook options
 */
export function useCity(
  id: number,
  options: {
    enabled?: boolean;
    onSuccess?: (data: CityMasterDTO) => void;
    onError?: (error: Error) => void;
  } = {}
): UseQueryResult<CityMasterDTO> {
  return useQuery(
    async () => {
      const response = await apiClient.get<CityMasterDTO>(`/city/${id}`);
      return response.data;
    },
    options
  );
}

/**
 * Hook to fetch paginated list of cities
 * @param params - Query parameters (page, size, sort, search)
 * @param options - Hook options
 */
export function useCities(
  params: ListQueryParams = {},
  options: {
    enabled?: boolean;
    onSuccess?: (data: PagedData<CityMasterDTO>) => void;
    onError?: (error: Error) => void;
  } = {}
): UseQueryResult<PagedData<CityMasterDTO>> {
  return useQuery(
    async () => {
      const response = await apiClient.get<PagedData<CityMasterDTO>>('/city/list', params);
      return response.data;
    },
    options
  );
}

/**
 * Hook to create a new city
 * @param options - Hook options
 */
export function useCreateCity(
  options: {
    onSuccess?: (data: ApiResponse<CityMasterDTO>, variables: CityMasterDTO) => void;
    onError?: (error: Error, variables: CityMasterDTO) => void;
  } = {}
): UseMutationState<ApiResponse<CityMasterDTO>, CityMasterDTO> {
  return useMutation(
    async (cityData: CityMasterDTO) => {
      return await apiClient.post<CityMasterDTO>('/city', cityData);
    },
    options
  );
}

/**
 * Hook to update an existing city
 * @param options - Hook options
 */
export function useUpdateCity(
  options: {
    onSuccess?: (
      data: ApiResponse<CityMasterDTO>,
      variables: { id: number; data: CityMasterDTO }
    ) => void;
    onError?: (error: Error, variables: { id: number; data: CityMasterDTO }) => void;
  } = {}
): UseMutationState<ApiResponse<CityMasterDTO>, { id: number; data: CityMasterDTO }> {
  return useMutation(
    async ({ id, data }: { id: number; data: CityMasterDTO }) => {
      return await apiClient.put<CityMasterDTO>(`/city/${id}`, data);
    },
    options
  );
}

/**
 * Hook to delete a city
 * @param options - Hook options
 */
export function useDeleteCity(
  options: {
    onSuccess?: (data: ApiResponse<void>, variables: number) => void;
    onError?: (error: Error, variables: number) => void;
  } = {}
): UseMutationState<ApiResponse<void>, number> {
  return useMutation(
    async (id: number) => {
      return await apiClient.delete<void>(`/city/${id}`);
    },
    options
  );
}
