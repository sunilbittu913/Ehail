/**
 * State Master API Hooks
 * React hooks for managing state data
 */

import { useQuery, useMutation } from './useBaseHooks';
import { apiClient } from './apiClient';
import {
  StateMaster,
  StateMasterDTO,
  ApiResponse,
  ListQueryParams,
  PagedData,
  UseQueryResult,
  UseMutationState,
} from './types';

/**
 * Hook to fetch a single state by ID
 * @param id - State ID
 * @param options - Hook options
 */
export function useState(
  id: number,
  options: {
    enabled?: boolean;
    onSuccess?: (data: StateMaster) => void;
    onError?: (error: Error) => void;
  } = {}
): UseQueryResult<StateMaster> {
  return useQuery(
    async () => {
      const response = await apiClient.get<StateMaster>(`/state/${id}`);
      return response.data;
    },
    options
  );
}

/**
 * Hook to fetch paginated list of states
 * @param params - Query parameters (page, size, sort, search)
 * @param options - Hook options
 */
export function useStates(
  params: ListQueryParams = {},
  options: {
    enabled?: boolean;
    onSuccess?: (data: PagedData<StateMaster>) => void;
    onError?: (error: Error) => void;
  } = {}
): UseQueryResult<PagedData<StateMaster>> {
  return useQuery(
    async () => {
      const response = await apiClient.get<PagedData<StateMaster>>('/state/list', params);
      return response.data;
    },
    options
  );
}

/**
 * Hook to create a new state
 * @param options - Hook options
 */
export function useCreateState(
  options: {
    onSuccess?: (data: ApiResponse<StateMaster>, variables: StateMasterDTO) => void;
    onError?: (error: Error, variables: StateMasterDTO) => void;
  } = {}
): UseMutationState<ApiResponse<StateMaster>, StateMasterDTO> {
  return useMutation(
    async (stateData: StateMasterDTO) => {
      return await apiClient.post<StateMaster>('/state', stateData);
    },
    options
  );
}

/**
 * Hook to update an existing state
 * @param options - Hook options
 */
export function useUpdateState(
  options: {
    onSuccess?: (
      data: ApiResponse<StateMaster>,
      variables: { id: number; data: StateMasterDTO }
    ) => void;
    onError?: (error: Error, variables: { id: number; data: StateMasterDTO }) => void;
  } = {}
): UseMutationState<ApiResponse<StateMaster>, { id: number; data: StateMasterDTO }> {
  return useMutation(
    async ({ id, data }: { id: number; data: StateMasterDTO }) => {
      return await apiClient.put<StateMaster>(`/state/${id}`, data);
    },
    options
  );
}

/**
 * Hook to delete a state
 * @param options - Hook options
 */
export function useDeleteState(
  options: {
    onSuccess?: (data: ApiResponse<void>, variables: number) => void;
    onError?: (error: Error, variables: number) => void;
  } = {}
): UseMutationState<ApiResponse<void>, number> {
  return useMutation(
    async (id: number) => {
      return await apiClient.delete<void>(`/state/${id}`);
    },
    options
  );
}
