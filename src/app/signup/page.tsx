"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "../components/AuthCard";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user, setUser, loading: authLoading } = useAuth();
  const { addToast } = useToast();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Don't render the form if auth is loading or user is logged in
  if (authLoading || user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {authLoading ? "Checking authentication..." : "Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Client-side validation
    if (!name || !email || !phone || !password || !confirm) {
      setError("Please fill out all fields");
      setLoading(false);
      return;
    }

    // Validate phone number (basic validation for Indian numbers)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit phone number");
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update auth context with user data
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          role: data.user.role,
          isEmailVerified: data.user.isEmailVerified,
        });

        // Show success message
        addToast(data.message, "success");

        // Clear form
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirm("");

        // Redirect to settings page where users can verify email if needed
        setTimeout(() => {
          router.push("/settings");
        }, 1000);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create account"
      subtitle="Join Hummusery for exclusive offers"
    >
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
          <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
            Full name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Jane Doe"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
            Phone number
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            className="mt-1 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="9876543210"
            maxLength={10}
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Enter 10-digit mobile number (required for payment)
          </p>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="At least 6 characters"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
            Confirm password
          </span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Repeat your password"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 disabled:hover:scale-100"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-orange-500 hover:underline">
            Sign in
          </a>
        </div>
      </form>
    </AuthCard>
  );
}
