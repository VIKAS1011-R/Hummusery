"use client";

import { useState, useEffect } from 'react';

interface ConnectionStats {
  connected: boolean;
  stats?: {
    connections?: {
      current: number;
    };
  };
  poolInfo?: {
    minPoolSize: number;
    maxPoolSize: number;
  };
  lastHealthCheck?: string;
  connectionAge?: number;
  error?: string;
}

export default function ConnectionMonitor() {
  const [stats, setStats] = useState<ConnectionStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/db-health');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch connection stats:', error);
      }
    };

    if (isVisible) {
      fetchStats();
      const interval = setInterval(fetchStats, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs border border-gray-600 hover:bg-gray-700"
      >
        DB {stats?.connected ? '🟢' : '🔴'}
      </button>
      
      {isVisible && stats && (
        <div className="absolute bottom-12 right-0 bg-gray-900 text-white p-4 rounded-lg shadow-lg border border-gray-600 min-w-80 text-xs">
          <h3 className="font-bold mb-2">Database Connection Status</h3>
          <div className="space-y-1">
            <div>Status: {stats.connected ? '🟢 Connected' : '🔴 Disconnected'}</div>
            {stats.lastHealthCheck && (
              <div>Last Check: {new Date(stats.lastHealthCheck).toLocaleTimeString()}</div>
            )}
            {stats.connectionAge && (
              <div>Connection Age: {Math.round(stats.connectionAge / 1000)}s</div>
            )}
            {stats.poolInfo && (
              <div>
                Pool: {stats.poolInfo.minPoolSize}-{stats.poolInfo.maxPoolSize} connections
              </div>
            )}
            {stats.stats?.connections && (
              <div>Active: {stats.stats.connections.current}</div>
            )}
            {stats.error && (
              <div className="text-red-400">Error: {stats.error}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}