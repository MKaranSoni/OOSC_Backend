/**
 * Execution Service — ML/Test Execution Engine Integration Boundary
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  INTEGRATION POINT FOR MEMBER 2 / FUTURE ML ENGINE              ║
 * ║                                                                  ║
 * ║  Current state: ML engine NOT implemented. Backend returns       ║
 * ║  CREATED after POST /api/run-suite and does not advance further. ║
 * ║                                                                  ║
 * ║  When ML engine is ready, implement one of:                      ║
 * ║                                                                  ║
 * ║  Option A — Polling                                              ║
 * ║    Poll GET /api/results/{suiteId} until status = COMPLETED.     ║
 * ║                                                                  ║
 * ║  Option B — WebSocket                                            ║
 * ║    Connect to ws://backend/ws/suites/{suiteId}/status            ║
 * ║                                                                  ║
 * ║  Option C — Server-Sent Events (SSE)                             ║
 * ║    GET /api/suites/{suiteId}/stream                              ║
 * ║                                                                  ║
 * ║  The UI (SuiteExecution page) consumes executionService only.    ║
 * ║  No changes to dashboard components are needed.                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import type { ExecutionState } from '../types/suite';
import type { ApiResponse } from '../types/api';

export interface ExecutionStatus {
  suiteId: string;
  state: ExecutionState;
  progress?: number;
  message?: string;
  updatedAt?: string;
}

/**
 * Gets execution status for a suite.
 * CURRENTLY RETURNS NULL — ML engine is not implemented.
 * MEMBER 2: Replace this function body with your execution mechanism.
 */
export async function getExecutionStatus(
  suiteId: string
): Promise<ApiResponse<ExecutionStatus>> {
  // ── ⚠️ INTEGRATION STUB — Replace with real polling/WS/SSE ──────────────
  // Example polling:
  //   const result = await getResults(suiteId);
  //   if (result.error) return { data: null, error: result.error };
  //   return { data: { suiteId, state: result.data!.status as ExecutionState }, error: null };
  // ─────────────────────────────────────────────────────────────────────────
  void suiteId;
  return { data: null, error: null };
}

/**
 * Subscribes to execution status updates. Returns cleanup function.
 * MEMBER 2: Implement polling/WebSocket/SSE here.
 * The onUpdate callback drives the UI — no component rewrites needed.
 */
export function subscribeToExecution(
  _suiteId: string,
  _onUpdate: (status: ExecutionStatus) => void,
  _onError: (error: ApiResponse<never>['error']) => void,
  _intervalMs = 3000
): () => void {
  // ── ⚠️ INTEGRATION STUB — Implement here ────────────────────────────────
  // Example polling:
  //   const id = setInterval(async () => {
  //     const res = await getExecutionStatus(_suiteId);
  //     if (res.error) { _onError(res.error); return; }
  //     if (res.data) _onUpdate(res.data);
  //     if (res.data?.state === 'COMPLETED' || res.data?.state === 'FAILED')
  //       clearInterval(id);
  //   }, _intervalMs);
  //   return () => clearInterval(id);
  // ─────────────────────────────────────────────────────────────────────────
  return () => {};
}
