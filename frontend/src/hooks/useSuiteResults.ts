import { useState, useEffect, useCallback } from 'react';
import { getSuiteResults } from '../services/resultsService';
import type { ResultsResponse } from '../types/result';
import type { ApiError } from '../types/api';

type LoadState = 'idle' | 'loading' | 'success' | 'error' | 'not_found';

export function useSuiteResults(suiteId: string | undefined) {
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [results, setResults] = useState<ResultsResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    if (!suiteId) return;
    setLoadState('loading');
    setError(null);
    const res = await getSuiteResults(suiteId);
    if (res.error) {
      setError(res.error);
      setLoadState(res.error.code === 'NOT_FOUND' ? 'not_found' : 'error');
      return;
    }
    setResults(res.data);
    setLoadState('success');
  }, [suiteId]);

  useEffect(() => { load(); }, [load]);

  return { loadState, results, error, reload: load };
}