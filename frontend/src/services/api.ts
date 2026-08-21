const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export interface RunSuiteRequest {
  agent_name: string;
  system_prompt: string;
  tools: Record<string, unknown>[];
}

export interface RunSuiteResponse {
  suite_id: string;
  status: string;
}

export interface TestResult {
  scenario_id?: string;
  scenario_type: string;
  user_prompt: string;
  passed: boolean;
  failure_mode: string;
  reasoning: string;
  trace: unknown;
}

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

export async function runSuite(
  request: RunSuiteRequest
): Promise<RunSuiteResponse> {
  const response = await fetch(`${API_BASE_URL}/api/run-suite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || `Failed to run reliability suite (${response.status})`
    );
  }

  return response.json();
}

export async function getResults(
  suiteId: string
): Promise<ResultsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/results/${suiteId}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || `Failed to fetch results (${response.status})`
    );
  }

  return response.json();
}

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error("Backend is unavailable");
  }

  return response.json();
}