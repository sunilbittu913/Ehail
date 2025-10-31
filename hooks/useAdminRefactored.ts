/**
 * Admin Service Hooks (Refactored with useApi)
 * Includes authentication, rider, and driver management
 */

import { useFetch, useMutation, buildUrl, fetchJson } from './useApi';
import { useState as useReactState, useCallback } from 'react';
import type {
  LoginRequest,
  LoginResponse,
  RiderDTO,
  DriverDTO,
  ApiResponse,
  ListQueryParams,
  PagedData,
} from './adminTypes';

const API_BASE_URL = 'http://3.13.116.236:8082';

// ============================================================================
// Authentication Token Management
// ============================================================================

let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
  localStorage.setItem('authToken', token);
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('authToken');
  }
  return authToken;
}

export function clearAuthToken() {
  authToken = null;
  localStorage.removeItem('authToken');
}

function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ============================================================================
// Authentication Hooks
// ============================================================================

export function useLogin(
  options: {
    onSuccess?: (data: LoginResponse, credentials: LoginRequest) => void;
    onError?: (error: Error, credentials: LoginRequest) => void;
  } = {}
) {
  return useMutation<LoginResponse, LoginRequest>(
    async (credentials) => {
      const url = buildUrl(API_BASE_URL, '/api/admin/login', {
        username: credentials.username,
        password: credentials.password,
      });
      
      const response = await fetchJson<LoginResponse>(url, {
        method: 'POST',
      });
      
      if (response.token) {
        setAuthToken(response.token);
      }
      
      return response;
    },
    options
  );
}

export function useLogout() {
  const [loading, setLoading] = useReactState(false);

  const logout = useCallback(() => {
    setLoading(true);
    try {
      clearAuthToken();
    } finally {
      setLoading(false);
    }
  }, []);

  return { logout, loading };
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useReactState<boolean>(() => {
    return !!getAuthToken();
  });

  const login = useCallback((token: string) => {
    setAuthToken(token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    login,
    logout,
    token: getAuthToken(),
  };
}

// ============================================================================
// Rider Hooks
// ============================================================================

export function useRider(
  id: number,
  options: {
    enabled?: boolean;
    onSuccess?: (data: RiderDTO) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const url = buildUrl(API_BASE_URL, `/riders/${id}`);
  
  const result = useFetch<ApiResponse<RiderDTO>>(url, {
    enabled: options.enabled,
    headers: getAuthHeaders(),
    onSuccess: (response) => response?.data && options.onSuccess?.(response.data),
    onError: options.onError,
  });

  return {
    data: result.data?.data || null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

export function useRiders(
  params: ListQueryParams = {},
  options: {
    enabled?: boolean;
    onSuccess?: (data: PagedData<RiderDTO>) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const url = buildUrl(API_BASE_URL, '/riders/list', {
    page: params.page || 0,
    size: params.size || 10,
    ...(params.sort && { sort: params.sort }),
    ...(params.search && { search: params.search }),
  });

  const result = useFetch<ApiResponse<PagedData<RiderDTO>>>(url, {
    enabled: options.enabled,
    headers: getAuthHeaders(),
    onSuccess: (response) => response?.data && options.onSuccess?.(response.data),
    onError: options.onError,
  });

  return {
    data: result.data?.data || null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

export function useCreateRider(
  options: {
    onSuccess?: (data: ApiResponse<RiderDTO>, variables: RiderDTO) => void;
    onError?: (error: Error, variables: RiderDTO) => void;
  } = {}
) {
  return useMutation<ApiResponse<RiderDTO>, RiderDTO>(
    async (riderData) => {
      const url = buildUrl(API_BASE_URL, '/riders');
      return fetchJson(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(riderData),
      });
    },
    options
  );
}

export function useUpdateRider(
  options: {
    onSuccess?: (
      data: ApiResponse<RiderDTO>,
      variables: { id: number; data: RiderDTO }
    ) => void;
    onError?: (error: Error, variables: { id: number; data: RiderDTO }) => void;
  } = {}
) {
  return useMutation<ApiResponse<RiderDTO>, { id: number; data: RiderDTO }>(
    async ({ id, data }) => {
      const url = buildUrl(API_BASE_URL, `/riders/${id}`);
      return fetchJson(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
    },
    options
  );
}

export function useDeleteRider(
  options: {
    onSuccess?: (data: ApiResponse<void>, variables: number) => void;
    onError?: (error: Error, variables: number) => void;
  } = {}
) {
  return useMutation<ApiResponse<void>, number>(
    async (id) => {
      const url = buildUrl(API_BASE_URL, `/riders/${id}`);
      return fetchJson(url, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    },
    options
  );
}

// ============================================================================
// Driver Hooks
// ============================================================================

export function useDriver(
  id: number,
  options: {
    enabled?: boolean;
    onSuccess?: (data: DriverDTO) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const url = buildUrl(API_BASE_URL, `/drivers/${id}`);
  
  const result = useFetch<ApiResponse<DriverDTO>>(url, {
    enabled: options.enabled,
    headers: getAuthHeaders(),
    onSuccess: (response) => response?.data && options.onSuccess?.(response.data),
    onError: options.onError,
  });

  return {
    data: result.data?.data || null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

export function useDrivers(
  params: ListQueryParams = {},
  options: {
    enabled?: boolean;
    onSuccess?: (data: PagedData<DriverDTO>) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const url = buildUrl(API_BASE_URL, '/drivers/list', {
    page: params.page || 0,
    size: params.size || 10,
    ...(params.sort && { sort: params.sort }),
    ...(params.search && { search: params.search }),
  });

  const result = useFetch<ApiResponse<PagedData<DriverDTO>>>(url, {
    enabled: options.enabled,
    headers: getAuthHeaders(),
    onSuccess: (response) => response?.data && options.onSuccess?.(response.data),
    onError: options.onError,
  });

  return {
    data: result.data?.data || null,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

export function useCreateDriver(
  options: {
    onSuccess?: (data: ApiResponse<DriverDTO>, variables: DriverDTO) => void;
    onError?: (error: Error, variables: DriverDTO) => void;
  } = {}
) {
  return useMutation<ApiResponse<DriverDTO>, DriverDTO>(
    async (driverData) => {
      const url = buildUrl(API_BASE_URL, '/drivers');
      return fetchJson(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(driverData),
      });
    },
    options
  );
}

export function useUpdateDriver(
  options: {
    onSuccess?: (
      data: ApiResponse<DriverDTO>,
      variables: { id: number; data: DriverDTO }
    ) => void;
    onError?: (error: Error, variables: { id: number; data: DriverDTO }) => void;
  } = {}
) {
  return useMutation<ApiResponse<DriverDTO>, { id: number; data: DriverDTO }>(
    async ({ id, data }) => {
      const url = buildUrl(API_BASE_URL, `/drivers/${id}`);
      return fetchJson(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
    },
    options
  );
}

export function useDeleteDriver(
  options: {
    onSuccess?: (data: ApiResponse<void>, variables: number) => void;
    onError?: (error: Error, variables: number) => void;
  } = {}
) {
  return useMutation<ApiResponse<void>, number>(
    async (id) => {
      const url = buildUrl(API_BASE_URL, `/drivers/${id}`);
      return fetchJson(url, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    },
    options
  );
}
