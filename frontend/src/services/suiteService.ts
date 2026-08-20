// import { postRunSuite } from '../api/suiteApi';
// import type { RunSuiteRequest, RunSuiteResponse } from '../types/suite';
// import type { ApiResponse } from '../types/api';
//
// export interface SuiteFormValidationError {
//   field: 'agent_name' | 'system_prompt' | 'tools';
//   message: string;
// }
//
// export function validateSuiteForm(
//   agentName: string,
//   systemPrompt: string,
//   tools: Record<string, unknown>[]
// ): SuiteFormValidationError[] {
//   const errors: SuiteFormValidationError[] = [];
//   if (!agentName || agentName.trim().length === 0) {
//     errors.push({ field: 'agent_name', message: 'Agent name is required.' });
//   }
//   if (!systemPrompt || systemPrompt.trim().length === 0) {
//     errors.push({ field: 'system_prompt', message: 'System prompt is required.' });
//   }
//   if (!Array.isArray(tools)) {
//     errors.push({ field: 'tools', message: 'Tools must be an array.' });
//   }
//   return errors;
// }
//
// export async function createSuite(
//   agentName: string,
//   systemPrompt: string,
//   tools: Record<string, unknown>[]
// ): Promise<ApiResponse<RunSuiteResponse>> {
//   const request: RunSuiteRequest = {
//     agent_name: agentName.trim(),
//     system_prompt: systemPrompt,
//     tools,
//   };
//   return postRunSuite(request);
// }
import type {
  RunSuiteRequest,
  RunSuiteResponse,
} from "../types/suite";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

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
    let message = "Failed to create test suite";

    try {
      const error = await response.json();
      message = error.message || message;
    } catch {
      // Keep default message
    }

    throw new Error(message);
  }

  return response.json();
}
