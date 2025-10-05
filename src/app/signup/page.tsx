"use client";

import React, { useState } from "react";
import AuthCard from "../components/AuthCard";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password || !confirm) {
      setError("Please fill out all fields");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    // placeholder: handle sign up
    console.log("signup", { name, email });
  };

  return (
    <AuthCard title="Create account" subtitle="Join Hummusery for exclusive offers">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-sm text-red-400">{error}</div>}

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
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105"
        >
          Create account
        </button>

        <div className="text-center text-sm text-gray-400">
          Already have an account? <a href="/login" className="text-orange-500 hover:underline">Sign in</a>
        </div>
      </form>
    </AuthCard>
  );
}
