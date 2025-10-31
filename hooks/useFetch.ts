/**
 * Reusable useFetch Hook with Abort Controller
 * Provides automatic cleanup, error handling, and loading states
 */

import { useState, useEffect, useCallback } from 'react';

export interface UseFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
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
 * Custom hook for fetching data with automatic cleanup
 * @param baseURL - Base API URL
 * @param path - API endpoint path
 * @param options - Fetch options
 */
export function useFetch<T = any>(
  baseURL: string,
  path: string,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    enabled = true,
    onSuccess,
    onError,
  } = options;

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

    const fetchData = async () => {
      try {
        const url = `${baseURL}${path}`;
        const fetchOptions: RequestInit = {
          method,
          signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...headers,
          },
        };

        if (body && method !== 'GET') {
          fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        let responseData: any;

        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        if (!signal.aborted) {
          setData(responseData);
          setLoading(false);
          onSuccess?.(responseData);
        }
      } catch (err) {
        if (!signal.aborted) {
          const error = err instanceof Error ? err : new Error('An unknown error occurred');
          setError(error);
          setLoading(false);
          onError?.(error);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [baseURL, path, method, body, enabled, refetchIndex, headers, onSuccess, onError]);

  return { data, loading, error, refetch };
}

/**
 * Hook for mutation operations (POST, PUT, DELETE)
 * Provides manual trigger instead of automatic fetching
 */
export interface UseMutationOptions<TData = any, TVariables = any> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
}

export interface UseMutationResult<TData = any, TVariables = any> {
  mutate: (variables: TVariables) => Promise<TData>;
  data: TData | null;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

export function useMutation<TData = any, TVariables = any>(
  baseURL: string,
  path: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
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
        const url = `${baseURL}${path}`;
        const response = await fetch(url, {
          method,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(variables),
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const responseData: TData = await response.json();
        setData(responseData);
        setLoading(false);
        onSuccess?.(responseData, variables);
        return responseData;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        setError(error);
        setLoading(false);
        onError?.(error, variables);
        throw error;
      }
    },
    [baseURL, path, method, onSuccess, onError]
  );

  return { mutate, data, loading, error, reset };
}
