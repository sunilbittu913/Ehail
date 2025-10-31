/**
 * Admin API Client Utility
 * Base HTTP client for making requests to the Aboosto Admin Service API
 */

import { ApiResponse } from './types';

export const ADMIN_API_BASE_URL = 'http://3.13.116.236:8082';

export interface AdminRequestConfig extends RequestInit {
  params?: Record<string, any>;
}

export class AdminApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private authToken: string | null = null;

  constructor(baseURL: string = ADMIN_API_BASE_URL, headers: Record<string, string> = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = null;
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Get current auth token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(key, String(v)));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    config: AdminRequestConfig = {}
  ): Promise<T> {
    const { params, headers, ...restConfig } = config;
    const url = this.buildURL(endpoint, params);

    try {
      const response = await fetch(url, {
        ...restConfig,
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      params,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Update base URL
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  /**
   * Update default headers
   */
  setHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };
  }
}

// Export singleton instance
export const adminApiClient = new AdminApiClient();
