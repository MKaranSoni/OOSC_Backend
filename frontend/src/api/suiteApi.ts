import { apiGet, apiPost } from './apiClient';
import type { RunSuiteRequest, RunSuiteResponse } from '../types/suite';
import type { ResultsResponse } from '../types/result';
import type { ApiResponse } from '../types/api';

/**
 * POST /api/run-suite
 * Creates a suite record. Backend sets status=CREATED.
 * The ML execution engine will process it separately (future integration).
 */
export function postRunSuite(request: RunSuiteRequest): Promise<ApiResponse<RunSuiteResponse>> {
  return apiPost<RunSuiteResponse>('/api/run-suite', request);
}

/**
 * GET /api/results/{suiteId}
 * Fetches test results once execution is complete.
 */
export function getResults(suiteId: string): Promise<ApiResponse<ResultsResponse>> {
  return apiGet<ResultsResponse>(`/api/results/${suiteId}`);
}
