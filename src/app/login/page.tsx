"use client";

import React, { useState } from "react";
import AuthCard from "../components/AuthCard";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    // Basic authentication logics

    console.log("login", { email, password, remember });
  };

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your Hummusery account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-sm text-red-400">{error}</div>}

        <label className="block">
          <span className="text-sm text-gray-300">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-300">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="••••••••"
            required
          />
        </label>

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center text-sm text-gray-300">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded bg-gray-700 text-orange-500 focus:ring-orange-500"
            />
            <span className="ml-2">Remember me</span>
          </label>

          <a href="#" className="text-sm text-orange-500 hover:underline">Forgot password?</a>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105"
        >
          Sign in
        </button>

        <div className="text-center text-sm text-gray-400">
          Don’t have an account? <a href="/signup" className="text-orange-500 hover:underline">Create one</a>
        </div>
      </form>
    </AuthCard>
  );
}
