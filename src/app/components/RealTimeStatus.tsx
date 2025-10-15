import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface RealTimeStatusProps {
  isConnected: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

export default function RealTimeStatus({ 
  isConnected, 
  error, 
  onRetry, 
  className = "" 
}: RealTimeStatusProps) {
  if (error) {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <WifiOff className="h-4 w-4 text-red-500" />
        <span className="text-red-500">Connection lost</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {isConnected ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span className="text-green-500">Real-time updates active</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-yellow-500" />
          <span className="text-yellow-500">Connecting...</span>
        </>
      )}
    </div>
  );
}