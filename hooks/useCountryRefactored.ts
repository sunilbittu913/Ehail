/**
 * Country Management Hooks (Refactored with useApi)
 * Clean, simple hooks using the new useFetch pattern
 */

import { useFetch, useMutation, buildUrl, fetchJson } from './useApi';
import type { CountryMaster, ApiResponse, ListQueryParams, PagedData } from './types';

const API_BASE_URL = 'http://3.13.116.236:8081';

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Fetch a single country by ID
 */
export function useCountry(
  id: number,
  options: {
    enabled?: boolean;
    onSuccess?: (data: CountryMaster) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const url = buildUrl(API_BASE_URL, `/country/${id}`);
  
  const result = useFetch<ApiResponse<CountryMaster>>(url, {
    enabled: options.enabled,
    onSuccess: (response) => {
      if (response?.data) {
        options.onSuccess?.(response.data);
      }
    },
    onError: options.onError,
  });

  return {
    data: result.data?.data || null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

/**
 * Fetch paginated list of countries
 */
export function useCountries(
  params: ListQueryParams = {},
  options: {
    enabled?: boolean;
    onSuccess?: (data: PagedData<CountryMaster>) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const url = buildUrl(API_BASE_URL, '/country/list', {
    page: params.page || 0,
    size: params.size || 10,
    ...(params.sort && { sort: params.sort }),
    ...(params.search && { search: params.search }),
  });

  const result = useFetch<ApiResponse<PagedData<CountryMaster>>>(url, {
    enabled: options.enabled,
    onSuccess: (response) => {
      if (response?.data) {
        options.onSuccess?.(response.data);
      }
    },
    onError: options.onError,
  });

  return {
    data: result.data?.data || null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new country
 */
export function useCreateCountry(
  options: {
    onSuccess?: (data: ApiResponse<CountryMaster>, variables: CountryMaster) => void;
    onError?: (error: Error, variables: CountryMaster) => void;
  } = {}
) {
  return useMutation<ApiResponse<CountryMaster>, CountryMaster>(
    async (countryData) => {
      const url = buildUrl(API_BASE_URL, '/country');
      return fetchJson(url, {
        method: 'POST',
        body: JSON.stringify(countryData),
      });
    },
    options
  );
}

/**
 * Update an existing country
 */
export function useUpdateCountry(
  options: {
    onSuccess?: (
      data: ApiResponse<CountryMaster>,
      variables: { id: number; data: CountryMaster }
    ) => void;
    onError?: (error: Error, variables: { id: number; data: CountryMaster }) => void;
  } = {}
) {
  return useMutation<ApiResponse<CountryMaster>, { id: number; data: CountryMaster }>(
    async ({ id, data }) => {
      const url = buildUrl(API_BASE_URL, `/country/${id}`);
      return fetchJson(url, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    options
  );
}

/**
 * Delete a country
 */
export function useDeleteCountry(
  options: {
    onSuccess?: (data: ApiResponse<void>, variables: number) => void;
    onError?: (error: Error, variables: number) => void;
  } = {}
) {
  return useMutation<ApiResponse<void>, number>(
    async (id) => {
      const url = buildUrl(API_BASE_URL, `/country/${id}`);
      return fetchJson(url, {
        method: 'DELETE',
      });
    },
    options
  );
}
