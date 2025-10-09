"use client";

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        {/* User Profile Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profile Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="bg-gray-700 text-white px-4 py-3 rounded-lg">
                {user.name}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                {user.email}
              </div>
            </div>
          </div>
        </div>

        {/* Account Security Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Account Security
          </h2>
          
          <div className="space-y-4">
            <button className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors duration-200">
              Change Password
            </button>
            
            <button className="w-full text-left bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors duration-200">
              Two-Factor Authentication
            </button>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            More settings options coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}