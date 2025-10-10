import React from "react";
import { Shield, Home } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedAccess() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-500/10 rounded-full">
              <Shield className="h-12 w-12 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            Access Denied
          </h1>
          
          <p className="text-gray-400 mb-6">
            You don&apos;t have permission to access this page. Admin privileges are required.
          </p>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}