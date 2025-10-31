/**
 * Country Management API Hooks (Refactored with useFetch)
 * React hooks for managing country master data
 */

import { useFetch, useMutation } from './useFetch';
import type { CountryMaster, ApiResponse, ListQueryParams, PagedData } from './types';

const API_BASE_URL = 'http://3.13.116.236:8081';

/**
 * Hook to fetch a single country by ID
 * @param id - Country ID
 * @param options - Hook options
 */
export function useCountry(
  id: number,
  options: {
    enabled?: boolean;
    onSuccess?: (data: CountryMaster) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const { enabled = true, onSuccess, onError } = options;

  const result = useFetch<ApiResponse<CountryMaster>>(
    API_BASE_URL,
    `/country/${id}`,
    {
      enabled,
      onSuccess: (response) => {
        if (response?.data) {
          onSuccess?.(response.data);
        }
      },
      onError,
    }
  );

  return {
    data: result.data?.data || null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

/**
 * Hook to fetch paginated list of countries
 * @param params - Query parameters (page, size, sort, search)
 * @param options - Hook options
 */
export function useCountries(
  params: ListQueryParams = {},
  options: {
    enabled?: boolean;
    onSuccess?: (data: PagedData<CountryMaster>) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const { enabled = true, onSuccess, onError } = options;
  const { page = 0, size = 10, sort, search } = params;

  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('size', size.toString());
  if (sort) queryParams.append('sort', sort);
  if (search) queryParams.append('search', search);

  const result = useFetch<ApiResponse<PagedData<CountryMaster>>>(
    API_BASE_URL,
    `/country/list?${queryParams.toString()}`,
    {
      enabled,
      onSuccess: (response) => {
        if (response?.data) {
          onSuccess?.(response.data);
        }
      },
      onError,
    }
  );

  return {
    data: result.data?.data || null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

/**
 * Hook to create a new country
 * @param options - Hook options
 */
export function useCreateCountry(
  options: {
    onSuccess?: (data: ApiResponse<CountryMaster>, variables: CountryMaster) => void;
    onError?: (error: Error, variables: CountryMaster) => void;
  } = {}
) {
  return useMutation<ApiResponse<CountryMaster>, CountryMaster>(
    API_BASE_URL,
    '/country',
    'POST',
    options
  );
}

/**
 * Hook to update an existing country
 * @param options - Hook options
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
  const [currentId, setCurrentId] = useState<number | null>(null);

  const mutation = useMutation<
    ApiResponse<CountryMaster>,
    { id: number; data: CountryMaster }
  >(
    API_BASE_URL,
    currentId !== null ? `/country/${currentId}` : '/country/0',
    'PUT',
    options
  );

  const mutate = async (variables: { id: number; data: CountryMaster }) => {
    setCurrentId(variables.id);
    return mutation.mutate(variables);
  };

  return {
    ...mutation,
    mutate,
  };
}

/**
 * Hook to delete a country
 * @param options - Hook options
 */
export function useDeleteCountry(
  options: {
    onSuccess?: (data: ApiResponse<void>, variables: number) => void;
    onError?: (error: Error, variables: number) => void;
  } = {}
) {
  const [currentId, setCurrentId] = useState<number | null>(null);

  const mutation = useMutation<ApiResponse<void>, number>(
    API_BASE_URL,
    currentId !== null ? `/country/${currentId}` : '/country/0',
    'DELETE',
    options
  );

  const mutate = async (id: number) => {
    setCurrentId(id);
    return mutation.mutate(id);
  };

  return {
    ...mutation,
    mutate,
  };
}

// Need to import useState
import { useState } from 'react';
