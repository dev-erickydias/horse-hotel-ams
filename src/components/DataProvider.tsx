import { useEffect, useState, type ReactNode } from 'react';
import { initializeData } from '../services/data';

export default function DataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    initializeData()
      .then(() => setReady(true))
      .catch(() => {
        setError(true);
        setReady(true);
      });
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-forest-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-gold-400 flex items-center justify-center text-forest-950 font-bold text-xl font-display shadow-lg shadow-gold-500/25">
            AH
          </div>
          <p className="text-forest-400 text-sm font-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('DataProvider: Supabase init failed, app running with seeded data.');
  }

  return <>{children}</>;
}
