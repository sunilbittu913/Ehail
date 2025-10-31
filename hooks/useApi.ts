/**
 * Simplified API Hooks using useFetch pattern
 * Provides cleaner API for both Configuration and Admin services
 */

import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// Core useFetch Hook
// ============================================================================

export interface UseFetchOptions {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Core fetch hook with abort controller and automatic cleanup
 */
export function useFetch<T = any>(
  url: string,
  options: RequestInit & UseFetchOptions = {}
): UseFetchResult<T> {
  const { enabled = true, onSuccess, onError, ...fetchOptions } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error | null>(null);
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = useCallback(() => {
    setRefetchIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading(true);
    setError(null);

    fetch(url, {
      ...fetchOptions,
      signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((responseData) => {
        if (!signal.aborted) {
          setData(responseData);
          setLoading(false);
          onSuccess?.(responseData);
        }
      })
      .catch((err) => {
        if (!signal.aborted) {
          const error = err instanceof Error ? err : new Error('Unknown error');
          setError(error);
          setLoading(false);
          onError?.(error);
        }
      });

    return () => abortController.abort();
  }, [url, enabled, refetchIndex]);

  return { data, loading, error, refetch };
}

// ============================================================================
// Mutation Hook
// ============================================================================

export interface UseMutationResult<TData = any, TVariables = any> {
  mutate: (variables: TVariables) => Promise<TData>;
  data: TData | null;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

export interface UseMutationOptions<TData = any, TVariables = any> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseMutationOptions<TData, TVariables> = {}
): UseMutationResult<TData, TVariables> {
  const { onSuccess, onError } = options;
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setLoading(true);
      setError(null);

      try {
        const result = await mutationFn(variables);
        setData(result);
        setLoading(false);
        onSuccess?.(result, variables);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        setLoading(false);
        onError?.(error, variables);
        throw error;
      }
    },
    [mutationFn, onSuccess, onError]
  );

  return { mutate, data, loading, error, reset };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Build URL with query parameters
 */
export function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, any>
): string {
  const url = new URL(path, baseUrl);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}

/**
 * Make a fetch request with JSON handling
 */
export async function fetchJson<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
