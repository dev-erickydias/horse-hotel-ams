import { useState, useEffect, useCallback } from 'react';
import { onDataChange, type DataEvent } from '../services/data';

/**
 * Reactive hook that re-renders whenever the specified data events fire.
 * Returns a `revision` number that increments on each change — use it
 * as a dependency in useMemo/useEffect to recompute derived data.
 *
 * @param events - One or more DataEvent names to listen to (e.g., 'horses', 'tasks')
 * @returns revision number (increments on every relevant data change)
 *
 * Usage:
 *   const rev = useData('horses', 'tasks');
 *   const horses = useMemo(() => api.getHorses(), [rev]);
 */
export function useData(...events: DataEvent[]): number {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const unsubs = events.map((event) =>
      onDataChange(event, () => setRevision((r) => r + 1))
    );
    return () => unsubs.forEach((unsub) => unsub());
  }, [events.join(',')]);

  return revision;
}
