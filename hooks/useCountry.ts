/**
 * Country Master API Hooks
 * React hooks for managing country data
 */

import { useQuery, useMutation } from './useBaseHooks';
import { apiClient } from './apiClient';
import {
  CountryMaster,
  CountryMasterDTO,
  ApiResponse,
  ListQueryParams,
  PagedData,
  UseQueryResult,
  UseMutationState,
} from './types';

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
): UseQueryResult<CountryMaster> {
  return useQuery(
    async () => {
      const response = await apiClient.get<CountryMaster>(`/country/${id}`);
      return response.data;
    },
    options
  );
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
): UseQueryResult<PagedData<CountryMaster>> {
  return useQuery(
    async () => {
      const response = await apiClient.get<PagedData<CountryMaster>>('/country/list', params);
      return response.data;
    },
    options
  );
}

/**
 * Hook to create a new country
 * @param options - Hook options
 */
export function useCreateCountry(
  options: {
    onSuccess?: (data: ApiResponse<CountryMaster>, variables: CountryMasterDTO) => void;
    onError?: (error: Error, variables: CountryMasterDTO) => void;
  } = {}
): UseMutationState<ApiResponse<CountryMaster>, CountryMasterDTO> {
  return useMutation(
    async (countryData: CountryMasterDTO) => {
      return await apiClient.post<CountryMaster>('/country', countryData);
    },
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
      variables: { id: number; data: CountryMasterDTO }
    ) => void;
    onError?: (error: Error, variables: { id: number; data: CountryMasterDTO }) => void;
  } = {}
): UseMutationState<ApiResponse<CountryMaster>, { id: number; data: CountryMasterDTO }> {
  return useMutation(
    async ({ id, data }: { id: number; data: CountryMasterDTO }) => {
      return await apiClient.put<CountryMaster>(`/country/${id}`, data);
    },
    options
  );
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
): UseMutationState<ApiResponse<void>, number> {
  return useMutation(
    async (id: number) => {
      return await apiClient.delete<void>(`/country/${id}`);
    },
    options
  );
}
