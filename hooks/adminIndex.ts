/**
 * Aboosto Admin Service API - React Hooks
 * Main entry point for all Admin API hooks and utilities
 */

// Export all admin types
export * from './adminTypes';

// Export Admin API client
export { adminApiClient, AdminApiClient, ADMIN_API_BASE_URL } from './adminApiClient';

// Export authentication hooks
export {
  useLogin,
  useLogout,
  useAuth,
  useRestoreAuth,
} from './useAuth';

// Export Rider hooks
export {
  useRider,
  useRiders,
  useCreateRider,
  useUpdateRider,
  useDeleteRider,
} from './useRider';

// Export Driver hooks
export {
  useDriver,
  useDrivers,
  useCreateDriver,
  useUpdateDriver,
  useDeleteDriver,
} from './useDriver';
