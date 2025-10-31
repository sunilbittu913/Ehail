/**
 * City Management Hooks (Refactored with useApi)
 */

import { useFetch, useMutation, buildUrl, fetchJson } from './useApi';
import type { CityMasterDTO, ApiResponse, ListQueryParams, PagedData } from './types';

const API_BASE_URL = 'http://3.13.116.236:8081';

export function useCity(
  id: number,
  options: {
    enabled?: boolean;
    onSuccess?: (data: CityMasterDTO) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const url = buildUrl(API_BASE_URL, `/city/${id}`);
  
  const result = useFetch<ApiResponse<CityMasterDTO>>(url, {
    enabled: options.enabled,
    onSuccess: (response) => response?.data && options.onSuccess?.(response.data),
    onError: options.onError,
  });

  return {
    data: result.data?.data || null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

export function useCities(
  params: ListQueryParams = {},
  options: {
    enabled?: boolean;
    onSuccess?: (data: PagedData<CityMasterDTO>) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const url = buildUrl(API_BASE_URL, '/city/list', {
    page: params.page || 0,
    size: params.size || 10,
    ...(params.sort && { sort: params.sort }),
    ...(params.search && { search: params.search }),
  });

  const result = useFetch<ApiResponse<PagedData<CityMasterDTO>>>(url, {
    enabled: options.enabled,
    onSuccess: (response) => response?.data && options.onSuccess?.(response.data),
    onError: options.onError,
  });

  return {
    data: result.data?.data || null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

export function useCreateCity(
  options: {
    onSuccess?: (data: ApiResponse<CityMasterDTO>, variables: CityMasterDTO) => void;
    onError?: (error: Error, variables: CityMasterDTO) => void;
  } = {}
) {
  return useMutation<ApiResponse<CityMasterDTO>, CityMasterDTO>(
    async (cityData) => {
      const url = buildUrl(API_BASE_URL, '/city');
      return fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(cityData),
      });
    },
    options
  );
}

export function useUpdateCity(
  options: {
    onSuccess?: (
      data: ApiResponse<CityMasterDTO>,
      variables: { id: number; data: CityMasterDTO }
    ) => void;
    onError?: (error: Error, variables: { id: number; data: CityMasterDTO }) => void;
  } = {}
) {
  return useMutation<ApiResponse<CityMasterDTO>, { id: number; data: CityMasterDTO }>(
    async ({ id, data }) => {
      const url = buildUrl(API_BASE_URL, `/city/${id}`);
      return fetchJson(url, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    options
  );
}

export function useDeleteCity(
  options: {
    onSuccess?: (data: ApiResponse<void>, variables: number) => void;
    onError?: (error: Error, variables: number) => void;
  } = {}
) {
  return useMutation<ApiResponse<void>, number>(
    async (id) => {
      const url = buildUrl(API_BASE_URL, `/city/${id}`);
      return fetchJson(url, {
        method: 'DELETE',
      });
    },
    options
  );
}
