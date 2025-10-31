/**
 * State Management Hooks (Refactored with useApi)
 */

import { useFetch, useMutation, buildUrl, fetchJson } from './useApi';
import type { StateMasterDTO, ApiResponse, ListQueryParams, PagedData } from './types';

const API_BASE_URL = 'http://3.13.116.236:8081';

export function useState(
  id: number,
  options: {
    enabled?: boolean;
    onSuccess?: (data: StateMasterDTO) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const url = buildUrl(API_BASE_URL, `/state/${id}`);
  
  const result = useFetch<ApiResponse<StateMasterDTO>>(url, {
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

export function useStates(
  params: ListQueryParams = {},
  options: {
    enabled?: boolean;
    onSuccess?: (data: PagedData<StateMasterDTO>) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const url = buildUrl(API_BASE_URL, '/state/list', {
    page: params.page || 0,
    size: params.size || 10,
    ...(params.sort && { sort: params.sort }),
    ...(params.search && { search: params.search }),
  });

  const result = useFetch<ApiResponse<PagedData<StateMasterDTO>>>(url, {
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

export function useCreateState(
  options: {
    onSuccess?: (data: ApiResponse<StateMasterDTO>, variables: StateMasterDTO) => void;
    onError?: (error: Error, variables: StateMasterDTO) => void;
  } = {}
) {
  return useMutation<ApiResponse<StateMasterDTO>, StateMasterDTO>(
    async (stateData) => {
      const url = buildUrl(API_BASE_URL, '/state');
      return fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(stateData),
      });
    },
    options
  );
}

export function useUpdateState(
  options: {
    onSuccess?: (
      data: ApiResponse<StateMasterDTO>,
      variables: { id: number; data: StateMasterDTO }
    ) => void;
    onError?: (error: Error, variables: { id: number; data: StateMasterDTO }) => void;
  } = {}
) {
  return useMutation<ApiResponse<StateMasterDTO>, { id: number; data: StateMasterDTO }>(
    async ({ id, data }) => {
      const url = buildUrl(API_BASE_URL, `/state/${id}`);
      return fetchJson(url, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    options
  );
}

export function useDeleteState(
  options: {
    onSuccess?: (data: ApiResponse<void>, variables: number) => void;
    onError?: (error: Error, variables: number) => void;
  } = {}
) {
  return useMutation<ApiResponse<void>, number>(
    async (id) => {
      const url = buildUrl(API_BASE_URL, `/state/${id}`);
      return fetchJson(url, {
        method: 'DELETE',
      });
    },
    options
  );
}
