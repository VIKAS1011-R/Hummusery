"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

export default function ThemeSelector() {
  const { theme, setTheme, loading } = useTheme();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Theme Preference
      </label>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Light Theme */}
        <button
          onClick={() => setTheme("light")}
          className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
            theme === "light"
              ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
              : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
          }`}
        >
          <Sun className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Light</div>
            <div className="text-sm opacity-75">Bright and clean</div>
          </div>
        </button>

        {/* Dark Theme */}
        <button
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
            theme === "dark"
              ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
              : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
          }`}
        >
          <Moon className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Dark</div>
            <div className="text-sm opacity-75">Easy on the eyes</div>
          </div>
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Your theme preference will be saved and applied across all your devices when you&apos;re logged in.
      </p>
    </div>
  );
}