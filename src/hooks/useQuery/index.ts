'use client';

import { useEffect, useRef, useState } from 'react';

interface Options {
  enabled?: boolean;
}


export function useQuery<T>(key: string, fetcher: (signal: AbortSignal) => Promise<T>, { enabled = true }: Options = {}) {
  const fetcherRef = useRef(fetcher);
  const [reloads, setReloads] = useState(0);
  const [state, setState] = useState<{ id: string; data?: T; error?: unknown }>({ id: '' });
  const id = `${key}#${reloads}`;

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    fetcherRef.current(controller.signal).then(
      (data) => setState({ id, data }),
      (error: unknown) => {
        if (!controller.signal.aborted) setState((current) => ({ id, data: current.data, error }));
      },
    );
    return () => controller.abort();
  }, [id, enabled]);

  const settled = state.id === id;
  return {
    data: state.data,
    error: settled ? state.error : undefined,
    isLoading: enabled && !settled,
    refetch: () => setReloads((n) => n + 1),
  };
}