/**
 * Aboosto Configuration Service API - TypeScript Type Definitions
 * Generated from OpenAPI 3.0.1 specification
 */

// Base API Response wrapper
export interface ApiResponse<T = any> {
  status: string;
  httpStatus: string;
  message: string;
  data: T;
}

// Country Master Entity
export interface CountryMaster {
  countryId?: number;
  code?: string;
  countryName?: string;
  createdBy?: string;
  createdDate?: string;
  createdSystemIp?: string;
  isDeletedValue?: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
  modifiedSystemIp?: string;
  remarks?: string;
  status?: string;
}

// Country Master DTO (for create/update operations)
export interface CountryMasterDTO {
  countryId?: number;
  code?: string;
  countryName?: string;
  createdBy?: string;
  createdDate?: string;
  isDeletedValue?: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
  remarks?: string;
  status?: string;
}

// State Master Entity
export interface StateMaster {
  stateId?: number;
  code?: string;
  stateName?: string;
  country?: CountryMaster;
  createdBy?: string;
  createdDate?: string;
  createdSystemIp?: string;
  isDeletedValue?: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
  modifiedSystemIp?: string;
  remarks?: string;
  status?: string;
}

// State Master DTO (for create/update operations)
export interface StateMasterDTO {
  stateId?: number;
  code?: string;
  stateName?: string;
  country?: CountryMaster;
  createdBy?: string;
  createdDate?: string;
  isDeletedValue?: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
  remarks?: string;
  status?: string;
}

// City Master DTO (for create/update operations)
export interface CityMasterDTO {
  cityId?: number;
  code?: string;
  cityName?: string;
  state?: StateMaster;
  createdBy?: string;
  createdDate?: string;
  isDeletedValue?: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
  remarks?: string;
  status?: string;
}

// Pagination parameters
export interface Pageable {
  page?: number; // minimum: 0
  size?: number; // minimum: 1
  sort?: string[];
}

// Paginated response data structure
export interface PagedData<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Query parameters for list endpoints
export interface ListQueryParams extends Pageable {
  search?: string;
}

// Hook configuration options
export interface UseApiOptions {
  baseURL?: string;
  headers?: Record<string, string>;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

// Hook state interface
export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Mutation hook state interface
export interface UseMutationState<TData, TVariables> {
  data: TData | null;
  loading: boolean;
  error: Error | null;
  mutate: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}

// Query hook return type
export interface UseQueryResult<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
}
