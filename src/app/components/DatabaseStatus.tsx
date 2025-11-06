"use client";

import { useEffect, useState } from "react";

interface DatabaseStatusProps {
  className?: string;
}

export default function DatabaseStatus({
  className = "",
}: DatabaseStatusProps) {
  const [status, setStatus] = useState<
    "checking" | "connected" | "disconnected"
  >("checking");
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
      });

      if (response.ok) {
        setStatus("connected");
      } else {
        setStatus("disconnected");
      }
    } catch (error) {
      setStatus("disconnected");
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    // Check status on mount
    checkDatabaseStatus();

    // Check status every 30 seconds
    const interval = setInterval(checkDatabaseStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development mode
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "text-green-600 dark:text-green-400";
      case "disconnected":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-yellow-600 dark:text-yellow-400";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return "●";
      case "disconnected":
        return "●";
      default:
        return "●";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "DB Connected";
      case "disconnected":
        return "DB Disconnected";
      default:
        return "Checking DB...";
    }
  };

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      <span className={`${getStatusColor()} animate-pulse`}>
        {getStatusIcon()}
      </span>
      <span className="text-gray-700 dark:text-gray-300">
        {getStatusText()}
      </span>
      {lastCheck && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {lastCheck.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
