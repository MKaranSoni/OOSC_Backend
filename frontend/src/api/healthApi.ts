import { apiGet } from './apiClient';
import type { HealthResponse } from '../types/suite';
import type { ApiResponse } from '../types/api';

/** GET /health — checks whether the Spring Boot backend is reachable */
export function checkHealth(): Promise<ApiResponse<HealthResponse>> {
  return apiGet<HealthResponse>('/health');
}
