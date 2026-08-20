import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSuite, validateSuiteForm, type SuiteFormValidationError } from '../services/suiteService';
import type { ExecutionState } from '../types/suite';
import type { ApiError } from '../types/api';

export interface SuiteCreationState {
  agentName: string;
  systemPrompt: string;
  tools: Record<string, unknown>[];
  executionState: ExecutionState;
  suiteId: string | null;
  validationErrors: SuiteFormValidationError[];
  apiError: ApiError | null;
  setAgentName: (v: string) => void;
  setSystemPrompt: (v: string) => void;
  setTools: (v: Record<string, unknown>[]) => void;
  submit: () => Promise<void>;
  reset: () => void;
}

export function useSuiteCreation(): SuiteCreationState {
  const navigate = useNavigate();
  const [agentName, setAgentName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [tools, setTools] = useState<Record<string, unknown>[]>([]);
  const [executionState, setExecutionState] = useState<ExecutionState>('IDLE');
  const [suiteId, setSuiteId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<SuiteFormValidationError[]>([]);
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const reset = useCallback(() => {
    setAgentName('');
    setSystemPrompt('');
    setTools([]);
    setExecutionState('IDLE');
    setSuiteId(null);
    setValidationErrors([]);
    setApiError(null);
  }, []);

  const submit = useCallback(async () => {
    if (executionState === 'SUBMITTING') return;
    const errors = validateSuiteForm(agentName, systemPrompt, tools);
    if (errors.length > 0) { setValidationErrors(errors); return; }
    setValidationErrors([]);
    setApiError(null);
    setExecutionState('SUBMITTING');

    const res = await createSuite(agentName, systemPrompt, tools);
    if (res.error) { setApiError(res.error); setExecutionState('ERROR'); return; }
    if (!res.data) {
      setApiError({ code: 'UNKNOWN', message: 'Received an empty response from the server.' });
      setExecutionState('ERROR');
      return;
    }
    setSuiteId(res.data.suite_id);
    setExecutionState('CREATED');
    navigate(`/suites/${res.data.suite_id}/execution`);
  }, [agentName, systemPrompt, tools, executionState, navigate]);

  return {
    agentName, systemPrompt, tools, executionState, suiteId,
    validationErrors, apiError,
    setAgentName, setSystemPrompt, setTools, submit, reset,
  };
}
