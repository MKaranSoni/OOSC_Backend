/**
 * API-level types — error contracts and common response shapes.
 * These match the Spring Boot backend contract exactly.
 */

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'MALFORMED_JSON'
  | 'NOT_FOUND'
  | 'INTERNAL_SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNKNOWN';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  /** HTTP status code, if available */
  status?: number;
  /** Original error for debugging — never shown to users */
  originalError?: unknown;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}
