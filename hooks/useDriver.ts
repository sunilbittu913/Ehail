/**
 * Driver Management API Hooks
 * React hooks for managing driver data
 */

import { useQuery, useMutation } from './useBaseHooks';
import { adminApiClient } from './adminApiClient';
import {
  DriverDTO,
  ApiResponse,
  ListQueryParams,
  PagedData,
  UseQueryResult,
  UseMutationState,
} from './adminTypes';

/**
 * Hook to fetch a single driver by ID
 * @param id - Driver ID
 * @param options - Hook options
 */
export function useDriver(
  id: number,
  options: {
    enabled?: boolean;
    onSuccess?: (data: DriverDTO) => void;
    onError?: (error: Error) => void;
  } = {}
): UseQueryResult<DriverDTO> {
  return useQuery(
    async () => {
      const response = await adminApiClient.get<ApiResponse<DriverDTO>>(`/drivers/${id}`);
      return response.data;
    },
    options
  );
}

/**
 * Hook to fetch paginated list of drivers
 * @param params - Query parameters (page, size, sort, search)
 * @param options - Hook options
 */
export function useDrivers(
  params: ListQueryParams = {},
  options: {
    enabled?: boolean;
    onSuccess?: (data: PagedData<DriverDTO>) => void;
    onError?: (error: Error) => void;
  } = {}
): UseQueryResult<PagedData<DriverDTO>> {
  return useQuery(
    async () => {
      const response = await adminApiClient.get<ApiResponse<PagedData<DriverDTO>>>(
        '/drivers/list',
        params
      );
      return response.data;
    },
    options
  );
}

/**
 * Hook to create a new driver
 * @param options - Hook options
 */
export function useCreateDriver(
  options: {
    onSuccess?: (data: ApiResponse<DriverDTO>, variables: DriverDTO) => void;
    onError?: (error: Error, variables: DriverDTO) => void;
  } = {}
): UseMutationState<ApiResponse<DriverDTO>, DriverDTO> {
  return useMutation(
    async (driverData: DriverDTO) => {
      return await adminApiClient.post<ApiResponse<DriverDTO>>('/drivers', driverData);
    },
    options
  );
}

/**
 * Hook to update an existing driver
 * @param options - Hook options
 */
export function useUpdateDriver(
  options: {
    onSuccess?: (
      data: ApiResponse<DriverDTO>,
      variables: { id: number; data: DriverDTO }
    ) => void;
    onError?: (error: Error, variables: { id: number; data: DriverDTO }) => void;
  } = {}
): UseMutationState<ApiResponse<DriverDTO>, { id: number; data: DriverDTO }> {
  return useMutation(
    async ({ id, data }: { id: number; data: DriverDTO }) => {
      return await adminApiClient.put<ApiResponse<DriverDTO>>(`/drivers/${id}`, data);
    },
    options
  );
}

/**
 * Hook to delete a driver
 * @param options - Hook options
 */
export function useDeleteDriver(
  options: {
    onSuccess?: (data: ApiResponse<void>, variables: number) => void;
    onError?: (error: Error, variables: number) => void;
  } = {}
): UseMutationState<ApiResponse<void>, number> {
  return useMutation(
    async (id: number) => {
      return await adminApiClient.delete<ApiResponse<void>>(`/drivers/${id}`);
    },
    options
  );
}
