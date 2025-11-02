"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AuthCard from "../components/AuthCard";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, setUser, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Don't render the form if auth is loading or user is logged in
  if (authLoading || user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">
            {authLoading ? "Checking authentication..." : "Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Please enter email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, remember }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        addToast(`Welcome back, ${data.user.name}!`, 'success');
        router.push('/');
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your Hummusery account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <label className="block">
          <span className="text-sm text-gray-300">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="mt-1 w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
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
            disabled={loading}
            className="mt-1 w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
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
              disabled={loading}
              className="h-4 w-4 rounded bg-gray-700 text-orange-500 focus:ring-orange-500 disabled:cursor-not-allowed"
            />
            <span className="ml-2">Remember me</span>
          </label>

          <Link href="/forgot-password" className="text-sm text-orange-500 hover:underline">Forgot password?</Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 disabled:hover:scale-100"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="text-center text-sm text-gray-400">
          Don’t have an account? <a href="/signup" className="text-orange-500 hover:underline">Create one</a>
        </div>
      </form>
    </AuthCard>
  );
}
