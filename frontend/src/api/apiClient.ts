/**
 * Centralized API client — single fetch wrapper for all backend requests.
 *
 * Base URL is read from VITE_API_BASE_URL environment variable.
 * Never hardcode localhost or any URL in component files.
 * All API modules (suiteApi, healthApi) go through this client.
 */

import type { ApiError, ApiErrorCode, ApiResponse } from '../types/api';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

if (!BASE_URL) {
  console.error(
    '[apiClient] VITE_API_BASE_URL is not set. ' +
      'Copy .env.example to .env.local and set the backend URL.'
  );
}

const DEFAULT_TIMEOUT_MS = 15_000;

function buildApiError(
  code: ApiErrorCode,
  message: string,
  status?: number,
  originalError?: unknown
): ApiError {
  return { code, message, status, originalError };
}

function httpStatusToCode(status: number): ApiErrorCode {
  if (status === 400) return 'VALIDATION_ERROR';
  if (status === 404) return 'NOT_FOUND';
  if (status >= 500) return 'INTERNAL_SERVER_ERROR';
  return 'UNKNOWN';
}

/**
 * Core fetch wrapper. Returns a normalized ApiResponse<T>. Never throws.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const body = await response.json();
        if (typeof body?.message === 'string') errorMessage = body.message;
        else if (typeof body?.error === 'string') errorMessage = body.error;
      } catch { /* body not JSON */ }
      return {
        data: null,
        error: buildApiError(httpStatusToCode(response.status), errorMessage, response.status),
      };
    }

    if (response.status === 204) return { data: null, error: null };

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const data = (await response.json()) as T;
      return { data, error: null };
    }

    return { data: null, error: null };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        data: null,
        error: buildApiError('TIMEOUT', 'The request timed out. Please check the backend is running.', undefined, err),
      };
    }
    return {
      data: null,
      error: buildApiError('NETWORK_ERROR', 'Unable to connect to Reliability Engine backend.', undefined, err),
    };
  }
}

export function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(path, { method: 'GET' });
}

export function apiPost<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  return apiRequest<T>(path, { method: 'POST', body: JSON.stringify(body) });
}
