import { useEffect, useState } from 'react';

export const useDatabaseWarmup = () => {
  const [isWarmedUp, setIsWarmedUp] = useState(false);
  const [isWarming, setIsWarming] = useState(false);

  useEffect(() => {
    const warmupDatabase = async () => {
      // Only warm up once per session
      if (isWarmedUp || isWarming) return;
      
      // Check if we've already warmed up in this session
      const sessionWarmedUp = sessionStorage.getItem('db-warmed-up');
      const warmupTimestamp = sessionStorage.getItem('db-warmup-time');
      
      // Check if warmup is still valid (within 30 minutes)
      if (sessionWarmedUp && warmupTimestamp) {
        const warmupTime = parseInt(warmupTimestamp);
        const now = Date.now();
        if (now - warmupTime < 30 * 60 * 1000) { // 30 minutes
          setIsWarmedUp(true);
          return;
        }
      }

      try {
        setIsWarming(true);
        console.log('🔥 Warming up database connection...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        const response = await fetch('/api/db-warmup', {
          method: 'POST',
          credentials: 'include',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Database warmed up successfully');
          setIsWarmedUp(true);
          sessionStorage.setItem('db-warmed-up', 'true');
          sessionStorage.setItem('db-warmup-time', Date.now().toString());
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.warn('⚠️ Database warmup failed:', errorData.error);
          // Still mark as "warmed up" to avoid repeated attempts
          setIsWarmedUp(true);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn('⚠️ Database warmup timed out');
        } else {
          console.warn('⚠️ Database warmup error:', error);
        }
        // Mark as warmed up to avoid repeated attempts
        setIsWarmedUp(true);
      } finally {
        setIsWarming(false);
      }
    };

    // Delay warmup slightly to let the app initialize first
    const timeoutId = setTimeout(warmupDatabase, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [isWarmedUp, isWarming]);

  return { isWarmedUp, isWarming };
};