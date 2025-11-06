'use client';

import { useEffect } from 'react';

export default function DatabaseWarmup() {
  useEffect(() => {
    // Warm up database connection on app load
    const warmupDatabase = async () => {
      try {
        // Make a lightweight API call to establish database connection
        await fetch('/api/health', {
          method: 'GET',
          cache: 'no-store'
        });
      } catch (error) {
        console.warn('Database warmup failed:', error);
      }
    };

    // Only run in production or when explicitly enabled
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_DB_WARMUP === 'true') {
      warmupDatabase();
    }
  }, []);

  // This component doesn't render anything
  return null;
}