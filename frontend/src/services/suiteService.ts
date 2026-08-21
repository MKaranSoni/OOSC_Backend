import { postRunSuite } from '../api/suiteApi';
import type { RunSuiteRequest, RunSuiteResponse } from '../types/suite';

export async function runSuite(
  request: RunSuiteRequest
): Promise<RunSuiteResponse> {
  const result = await postRunSuite(request);
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result.data as RunSuiteResponse;
}
