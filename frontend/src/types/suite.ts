/**
 * Suite-related types — mirror the Spring Boot backend contract exactly.
 *
 * Backend endpoints covered:
 *   POST /api/run-suite  → RunSuiteRequest / RunSuiteResponse
 *   GET  /health         → HealthResponse
 *
 * ExecutionState is a frontend-only state machine:
 *   IDLE → SUBMITTING → CREATED → RUNNING → COMPLETED | FAILED | ERROR
 *
 * The transition CREATED → RUNNING → COMPLETED is driven by the
 * future ML/test-execution engine. See executionService.ts for the
 * designated integration boundary.
 */

// ── Backend request/response ─────────────────────────────────────────────────

export interface RunSuiteRequest {
  agent_name: string;
  system_prompt: string;
  /** tools is List<Map<String,Object>> on the backend — no fixed schema */
  tools: Record<string, unknown>[];
}

export interface RunSuiteResponse {
  suite_id: string;
  status: string;
}

export interface HealthResponse {
  status: 'UP' | string;
}

// ── Frontend state machine ────────────────────────────────────────────────────

/**
 * Frontend execution state.
 * CREATED = backend acknowledged; ML engine has not started yet.
 */
export type ExecutionState =
  | 'IDLE'
  | 'SUBMITTING'
  | 'CREATED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'ERROR';

/** Stored suite record in local state while awaiting execution */
export interface CreatedSuite {
  suite_id: string;
  agent_name: string;
  system_prompt: string;
  tools: Record<string, unknown>[];
  created_at: string;
  executionState: ExecutionState;
}
