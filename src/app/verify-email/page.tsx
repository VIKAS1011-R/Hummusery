"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const token = searchParams.get('token');

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && verificationStatus === 'pending') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, verificationStatus]);

  // Redirect if user is already verified
  useEffect(() => {
    if (user?.isEmailVerified) {
      router.push('/');
    }
  }, [user, router]);

  const handleTokenVerification = useCallback(async (verificationToken: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        addToast(data.message, 'success');
        await refreshUser();
        setTimeout(() => router.push('/settings'), 2000);
      } else {
        setVerificationStatus('error');
        addToast(data.error, 'error');
      }
    } catch {
      setVerificationStatus('error');
      addToast('Failed to verify email. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, refreshUser, router]);

  // Handle token-based verification (fallback link)
  useEffect(() => {
    if (token) {
      handleTokenVerification(token);
    }
  }, [token, handleTokenVerification]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    
    if (code.length !== 6) {
      addToast('Please enter the complete 6-digit code', 'error');
      return;
    }

    if (!user?.email) {
      addToast('User email not found. Please try logging in again.', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: user.email, 
          otp: code 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        addToast(data.message, 'success');
        await refreshUser();
        setTimeout(() => router.push('/settings'), 2000);
      } else {
        setVerificationStatus('error');
        addToast(data.error, 'error');
        // Clear OTP on error
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setVerificationStatus('error');
      addToast('Failed to verify code. Please try again.', 'error');
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!user?.email) {
      addToast('User email not found. Please try logging in again.', 'error');
      return;
    }

    try {
      setResending(true);
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();

      if (response.ok) {
        addToast('New verification code sent to your email', 'success');
        setTimeLeft(600); // Reset timer
        setOtp(["", "", "", "", "", ""]);
        setVerificationStatus('pending');
        inputRefs.current[0]?.focus();
      } else {
        addToast(data.error, 'error');
      }
    } catch {
      addToast('Failed to resend code. Please try again.', 'error');
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              {verificationStatus === 'success' ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : verificationStatus === 'error' ? (
                <AlertCircle className="w-8 h-8 text-red-600" />
              ) : (
                <Mail className="w-8 h-8 text-orange-600" />
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {verificationStatus === 'success' ? 'Email Verified!' : 'Verify Your Email'}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {verificationStatus === 'success' 
                ? 'Welcome to Hummusery! Redirecting you...'
                : `We sent a 6-digit code to ${user.email}`
              }
            </p>
          </div>

          {verificationStatus === 'pending' && (
            <>
              {/* OTP Input */}
              <div className="mb-6">
                <div className="flex gap-3 justify-center mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:outline-none transition-colors"
                      disabled={loading}
                    />
                  ))}
                </div>
                
                {/* Timer */}
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Code expires in: <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
                  </p>
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={() => handleVerifyOtp()}
                disabled={loading || otp.some(digit => digit === '')}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed mb-4"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              {/* Resend */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Didn&apos;t receive the code?
                </p>
                <button
                  onClick={handleResendOtp}
                  disabled={resending || timeLeft > 540} // Allow resend after 1 minute
                  className="text-orange-600 hover:text-orange-700 disabled:text-gray-400 text-sm font-medium flex items-center gap-1 mx-auto disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                  {resending ? 'Sending...' : 'Resend Code'}
                </button>
                {timeLeft > 540 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Available in {formatTime(timeLeft - 540)}
                  </p>
                )}
              </div>
            </>
          )}

          {verificationStatus === 'success' && (
            <div className="text-center">
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-green-100 rounded-full mx-auto mb-4"></div>
              </div>
              <p className="text-green-600 font-medium">Redirecting to settings...</p>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function VerifyEmailLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading verification page...</p>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
}