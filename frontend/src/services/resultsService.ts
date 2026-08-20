import { getResults } from '../api/suiteApi';
import type { ResultsResponse, ScenarioTypeGroup, FailureModeGroup } from '../types/result';
import type { ApiResponse } from '../types/api';

/** GET /api/results/{suiteId} */
export async function getSuiteResults(suiteId: string): Promise<ApiResponse<ResultsResponse>> {
  return getResults(suiteId);
}

/** Groups results by scenario_type. Null types become "Unknown". */
export function groupByScenarioType(results: ResultsResponse['results']): ScenarioTypeGroup[] {
  const map = new Map<string, ScenarioTypeGroup>();
  for (const r of results) {
    const key = r.scenario_type ?? 'Unknown';
    const ex = map.get(key);
    if (ex) {
      ex.count++;
      if (r.passed === true) ex.passed++;
      if (r.passed === false) ex.failed++;
    } else {
      map.set(key, {
        scenario_type: key,
        count: 1,
        passed: r.passed === true ? 1 : 0,
        failed: r.passed === false ? 1 : 0,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

/** Groups failed results by failure_mode. */
export function groupByFailureMode(results: ResultsResponse['results']): FailureModeGroup[] {
  const map = new Map<string, number>();
  for (const r of results) {
    if (!r.failure_mode) continue;
    map.set(r.failure_mode, (map.get(r.failure_mode) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([failure_mode, count]) => ({ failure_mode, count }))
    .sort((a, b) => b.count - a.count);
}
