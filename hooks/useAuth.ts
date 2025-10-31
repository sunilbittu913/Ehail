/**
 * Authentication Hooks
 * React hooks for managing authentication and login
 */

import { useState, useCallback } from 'react';
import { useMutation } from './useBaseHooks';
import { adminApiClient } from './adminApiClient';
import { LoginRequest, LoginResponse } from './adminTypes';

/**
 * Hook to handle admin login
 * @param options - Hook options
 */
export function useLogin(
  options: {
    onSuccess?: (data: LoginResponse, credentials: LoginRequest) => void;
    onError?: (error: Error, credentials: LoginRequest) => void;
  } = {}
) {
  const { onSuccess, onError } = options;

  const mutation = useMutation<LoginResponse, LoginRequest>(
    async (credentials: LoginRequest) => {
      const response = await adminApiClient.post<LoginResponse>(
        '/api/admin/login',
        undefined,
        {
          username: credentials.username,
          password: credentials.password,
        }
      );
      
      // Store token if present in response
      if (response.token) {
        adminApiClient.setAuthToken(response.token);
        localStorage.setItem('authToken', response.token);
      }
      
      return response;
    },
    {
      onSuccess: (data, variables) => {
        onSuccess?.(data, variables);
      },
      onError: (error, variables) => {
        onError?.(error, variables);
      },
    }
  );

  return mutation;
}

/**
 * Hook to handle logout
 */
export function useLogout() {
  const [loading, setLoading] = useState(false);

  const logout = useCallback(() => {
    setLoading(true);
    try {
      // Clear token from client
      adminApiClient.clearAuthToken();
      
      // Clear token from localStorage
      localStorage.removeItem('authToken');
      
      // Clear any other auth-related data
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    logout,
    loading,
  };
}

/**
 * Hook to check authentication status
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      adminApiClient.setAuthToken(token);
      return true;
    }
    return false;
  });

  const login = useCallback((token: string) => {
    adminApiClient.setAuthToken(token);
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    adminApiClient.clearAuthToken();
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    login,
    logout,
    token: adminApiClient.getAuthToken(),
  };
}

/**
 * Hook to restore authentication from localStorage
 */
export function useRestoreAuth() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const restore = useCallback(() => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        adminApiClient.setAuthToken(token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to restore authentication:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-restore on mount
  useState(() => {
    restore();
  });

  return {
    loading,
    isAuthenticated,
    restore,
  };
}
