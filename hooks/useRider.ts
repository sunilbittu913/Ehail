/**
 * Rider Management API Hooks
 * React hooks for managing rider data
 */

import { useQuery, useMutation } from './useBaseHooks';
import { adminApiClient } from './adminApiClient';
import {
  RiderDTO,
  ApiResponse,
  ListQueryParams,
  PagedData,
  UseQueryResult,
  UseMutationState,
} from './adminTypes';

/**
 * Hook to fetch a single rider by ID
 * @param id - Rider ID
 * @param options - Hook options
 */
export function useRider(
  id: number,
  options: {
    enabled?: boolean;
    onSuccess?: (data: RiderDTO) => void;
    onError?: (error: Error) => void;
  } = {}
): UseQueryResult<RiderDTO> {
  return useQuery(
    async () => {
      const response = await adminApiClient.get<ApiResponse<RiderDTO>>(`/riders/${id}`);
      return response.data;
    },
    options
  );
}

/**
 * Hook to fetch paginated list of riders
 * @param params - Query parameters (page, size, sort, search)
 * @param options - Hook options
 */
export function useRiders(
  params: ListQueryParams = {},
  options: {
    enabled?: boolean;
    onSuccess?: (data: PagedData<RiderDTO>) => void;
    onError?: (error: Error) => void;
  } = {}
): UseQueryResult<PagedData<RiderDTO>> {
  return useQuery(
    async () => {
      const response = await adminApiClient.get<ApiResponse<PagedData<RiderDTO>>>(
        '/riders/list',
        params
      );
      return response.data;
    },
    options
  );
}

/**
 * Hook to create a new rider
 * @param options - Hook options
 */
export function useCreateRider(
  options: {
    onSuccess?: (data: ApiResponse<RiderDTO>, variables: RiderDTO) => void;
    onError?: (error: Error, variables: RiderDTO) => void;
  } = {}
): UseMutationState<ApiResponse<RiderDTO>, RiderDTO> {
  return useMutation(
    async (riderData: RiderDTO) => {
      return await adminApiClient.post<ApiResponse<RiderDTO>>('/riders', riderData);
    },
    options
  );
}

/**
 * Hook to update an existing rider
 * @param options - Hook options
 */
export function useUpdateRider(
  options: {
    onSuccess?: (
      data: ApiResponse<RiderDTO>,
      variables: { id: number; data: RiderDTO }
    ) => void;
    onError?: (error: Error, variables: { id: number; data: RiderDTO }) => void;
  } = {}
): UseMutationState<ApiResponse<RiderDTO>, { id: number; data: RiderDTO }> {
  return useMutation(
    async ({ id, data }: { id: number; data: RiderDTO }) => {
      return await adminApiClient.put<ApiResponse<RiderDTO>>(`/riders/${id}`, data);
    },
    options
  );
}

/**
 * Hook to delete a rider
 * @param options - Hook options
 */
export function useDeleteRider(
  options: {
    onSuccess?: (data: ApiResponse<void>, variables: number) => void;
    onError?: (error: Error, variables: number) => void;
  } = {}
): UseMutationState<ApiResponse<void>, number> {
  return useMutation(
    async (id: number) => {
      return await adminApiClient.delete<ApiResponse<void>>(`/riders/${id}`);
    },
    options
  );
}
