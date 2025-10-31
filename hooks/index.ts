/**
 * Aboosto Configuration Service API - React Hooks
 * Main entry point for all API hooks and utilities
 */

// Export all types
export * from './types';

// Export API client
export { apiClient, ApiClient, DEFAULT_BASE_URL } from './apiClient';

// Export base hooks
export { useQuery, useMutation } from './useBaseHooks';

// Export Country hooks
export {
  useCountry,
  useCountries,
  useCreateCountry,
  useUpdateCountry,
  useDeleteCountry,
} from './useCountry';

// Export State hooks
export {
  useState,
  useStates,
  useCreateState,
  useUpdateState,
  useDeleteState,
} from './useState';

// Export City hooks
export {
  useCity,
  useCities,
  useCreateCity,
  useUpdateCity,
  useDeleteCity,
} from './useCity';
