import type { ExecutionState } from '../types/suite';

export function formatExecutionState(state: ExecutionState): string {
  const labels: Record<ExecutionState, string> = {
    IDLE: 'Idle',
    SUBMITTING: 'Submitting…',
    CREATED: 'Awaiting Execution',
    RUNNING: 'Running Tests',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    ERROR: 'Error',
  };
  return labels[state] ?? state;
}

export function executionStateDescription(state: ExecutionState): string {
  const desc: Record<ExecutionState, string> = {
    IDLE: 'No suite is currently active.',
    SUBMITTING: 'Sending suite configuration to backend…',
    CREATED: 'Suite created and queued — waiting for the test execution engine to begin processing.',
    RUNNING: 'Reliability tests are currently executing.',
    COMPLETED: 'Test execution completed. Results are ready.',
    FAILED: 'Test execution failed. Review the error details.',
    ERROR: 'An error occurred while processing this suite.',
  };
  return desc[state] ?? '';
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function scoreToLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Moderate';
  if (score >= 40) return 'Poor';
  return 'Critical';
}

export function formatDatetime(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso));
  } catch { return iso; }
}

export function truncateSuiteId(suiteId: string, length = 8): string {
  return suiteId.substring(0, length).toUpperCase();
}

export function displayScenarioType(type: string | null): string {
  if (!type) return '—';
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function displayFailureMode(mode: string | null): string {
  if (!mode) return '—';
  return mode.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
