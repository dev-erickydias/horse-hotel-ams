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
        setReady(true); // still render app even if Supabase fails
      });
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-amber-600/30">
            AH
          </div>
          <p className="text-stone-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('DataProvider: Supabase init failed, app running with empty state.');
  }

  return <>{children}</>;
}
