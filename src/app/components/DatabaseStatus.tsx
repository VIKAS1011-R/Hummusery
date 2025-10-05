"use client";

import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, Loader } from 'lucide-react';

interface DbStatus {
  status: 'success' | 'error';
  message: string;
  connected: boolean;
}

const DatabaseStatus: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDbStatus = async () => {
      try {
        const response = await fetch('/api/db-status');
        const data = await response.json();
        setDbStatus(data);
      } catch (error) {
        setDbStatus({
          status: 'error',
          message: 'Failed to check database connection',
          connected: false
        });
      } finally {
        setLoading(false);
      }
    };

    checkDbStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <Loader className="w-4 h-4 animate-spin" />
        <span className="text-sm">Checking database connection...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Database className="w-4 h-4 text-gray-400" />
      {dbStatus?.connected ? (
        <div className="flex items-center gap-1 text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Database Connected</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 text-red-400">
          <XCircle className="w-4 h-4" />
          <span className="text-sm">Database Disconnected</span>
        </div>
      )}
    </div>
  );
};

export default DatabaseStatus;