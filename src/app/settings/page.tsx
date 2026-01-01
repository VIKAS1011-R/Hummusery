"use client";

import React, { useState, useEffect, useRef } from "react";
import { User, Phone, Mail, Shield, Save, ArrowLeft, Palette, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PageWrapper from "@/app/components/PageWrapper";
import ThemeSelector from "@/app/components/ThemeSelector";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";

export default function SettingsPage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const hasRefreshedOnMount = useRef(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Refresh user data when component mounts to get latest verification status
  useEffect(() => {
    if (!authLoading && user && !hasRefreshedOnMount.current) {

      hasRefreshedOnMount.current = true;
      refreshUser();
    }
  }, [authLoading, user, refreshUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Phone validation
      const phoneRegex = /^[6-9]\d{9}$/;
      if (formData.phone && !phoneRegex.test(formData.phone)) {
        addToast("Please enter a valid 10-digit phone number", "error");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        addToast("Profile updated successfully!", "success");
      } else {
        throw new Error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      addToast("Failed to update profile. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!user?.email) {
      addToast("No email address found", "error");
      return;
    }

    try {
      setVerificationLoading(true);
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();

      if (response.ok) {
        addToast('Verification email sent! Check your inbox.', 'success');
      } else {
        addToast(data.error || 'Failed to send verification email', 'error');
      }
    } catch {
      addToast('Failed to send verification email', 'error');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    try {
      setVerificationLoading(true);
      await refreshUser();
      addToast('Status refreshed!', 'success');
    } catch {
      addToast('Failed to refresh status', 'error');
    } finally {
      setVerificationLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navbar />
        <PageWrapper>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navbar />
        <PageWrapper>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please Log In</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">You need to be logged in to access settings.</p>
              <Link
                href="/login"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Log In
              </Link>
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }

  // Redirect to verify email if not verified
  if (user && !user.isEmailVerified) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navbar />
        <PageWrapper>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md mx-auto px-4">
              <Mail className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Email Verification Required
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please verify your email address to access your account settings.
              </p>
              <Link
                href="/verify-email"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Verify Email Now
              </Link>
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar />
      
      <PageWrapper>
        {/* Header */}
        <section className="pb-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account information and preferences
          </p>
        </div>
      </section>

      {/* Settings Content */}
      <section className="py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Theme Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </h2>
            <ThemeSelector />
          </div>

          {/* Profile Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-300 dark:border-gray-600"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-300 dark:border-gray-600"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-300 dark:border-gray-600"
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Required for payment processing</p>
              </div>

              {/* Role Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Shield className="h-4 w-4 inline mr-2" />
                  Account Type
                </label>
                <div className="w-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-500">
                  {user.role === "admin" ? "Administrator" : "Customer"}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Email Verification Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Verification
            </h2>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {user?.isEmailVerified ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-medium">Email Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <span className="text-amber-600 font-medium">Email Not Verified</span>
                    </>
                  )}
                  <button
                    onClick={handleRefreshStatus}
                    disabled={verificationLoading}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                    title="Refresh verification status"
                  >
                    <RefreshCw className={`h-4 w-4 ${verificationLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {user?.isEmailVerified 
                    ? "Your email address has been verified. You'll receive order confirmations and important updates."
                    : "Verify your email to receive order confirmations and important updates."
                  }
                </p>
                
                {!user?.isEmailVerified && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Benefits of Email Verification:
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Order confirmations and updates</li>
                      <li>• Account security notifications</li>
                      <li>• Password reset capability</li>
                      <li>• Special offers and promotions</li>
                      <li>• Important announcements</li>
                    </ul>
                  </div>
                )}
              </div>
              
              {!user?.isEmailVerified && (
                <div className="ml-6">
                  <button
                    onClick={handleSendVerificationEmail}
                    disabled={verificationLoading}
                    className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
                  >
                    {verificationLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        Verify Email
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    We&apos;ll send a code to<br />{user?.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Member since:</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Account Status:</span>
                <span className="text-green-600 dark:text-green-400">Active</span>
              </div>
            </div>
          </div>
        </div>
        </section>

        <Footer />
      </PageWrapper>
    </div>
  );
}