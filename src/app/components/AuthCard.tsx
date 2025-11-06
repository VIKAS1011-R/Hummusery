"use client";

import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const AuthCard: React.FC<Props> = ({ title, subtitle, children, footer }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-lg font-bold">H</div>
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
          </div>
        </div>

        <div className="space-y-4">
          {children}
        </div>

        {footer && <div className="mt-6 text-center text-sm text-gray-400">{footer}</div>}
      </div>
    </div>
  );
};

export default AuthCard;
