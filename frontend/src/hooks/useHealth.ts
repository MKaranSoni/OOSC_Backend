import { useState, useEffect, useCallback } from 'react';
import { checkHealth } from '../api/healthApi';

export type HealthStatus = 'checking' | 'up' | 'down';

const POLL_INTERVAL_MS = 30_000;

export function useHealth(): { status: HealthStatus; refresh: () => void } {
  const [status, setStatus] = useState<HealthStatus>('checking');

  const check = useCallback(async () => {
    const res = await checkHealth();
    if (res.error || !res.data) {
      setStatus('down');
    } else {
      setStatus(res.data.status === 'UP' ? 'up' : 'down');
    }
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [check]);

  return { status, refresh: check };
}
