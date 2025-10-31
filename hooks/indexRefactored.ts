/**
 * Main Entry Point for Refactored Hooks
 * All hooks now use the improved useFetch pattern with abort controllers
 */

// Core API utilities
export * from './useApi';

// Configuration Service Hooks (Port 8081)
export * from './useCountryRefactored';
export * from './useStateRefactored';
export * from './useCityRefactored';

// Admin Service Hooks (Port 8082)
export * from './useAdminRefactored';

// Type exports
export * from './types';
export * from './adminTypes';
