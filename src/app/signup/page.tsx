"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { setUser } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Client-side validation
    if (!name || !email || !password || !confirm) {
      setError("Please fill out all fields");
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update auth context with user data
        setUser({
          name: data.user.name,
          email: data.user.email,
        });
        
        // Show toast and redirect
        addToast(`Welcome to Hummusery, ${data.user.name}!`, 'success');
        
        // Clear form
        setName('');
        setEmail('');
        setPassword('');
        setConfirm('');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create account" subtitle="Join Hummusery for exclusive offers">
      <form onSubmit={handleSubmit} method="POST" className="space-y-4">
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        <label className="block">
          <span className="text-sm text-gray-300">Full name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Jane Doe"
            required
          />
        </label>

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
            placeholder="At least 6 characters"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-300">Confirm password</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Repeat your password"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 disabled:hover:scale-100"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <div className="text-center text-sm text-gray-400">
          Already have an account? <a href="/login" className="text-orange-500 hover:underline">Sign in</a>
        </div>
      </form>
    </AuthCard>
  );
}
