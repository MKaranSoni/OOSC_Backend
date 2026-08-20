/**
 * Result types — mirror GET /api/results/{suiteId} backend response exactly.
 * Do NOT add fields that the backend does not return.
 */

/** A single test scenario result returned by the backend */
export interface TestResult {
  id: string;
  scenario_type: string | null;
  user_prompt: string | null;
  passed: boolean | null;
  failure_mode: string | null;
  reasoning: string | null;
  /** Raw execution trace — structure depends on ML engine implementation */
  trace: unknown;
}

/** Full response from GET /api/results/{suiteId} */
export interface ResultsResponse {
  suite_id: string;
  agent_name: string;
  score: number;
  status: string;
  passed: number;
  failed: number;
  total: number;
  results: TestResult[];
}

/** Grouped scenario type distribution — derived from results[].scenario_type */
export interface ScenarioTypeGroup {
  scenario_type: string;
  count: number;
  passed: number;
  failed: number;
}

/** Grouped failure mode distribution — derived from results[].failure_mode */
export interface FailureModeGroup {
  failure_mode: string;
  count: number;
}
