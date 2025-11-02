"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: { id: string; name: string; email: string; phone: string; role: string; theme?: "light" | "dark"; isEmailVerified?: boolean } | null;
  setUser: (user: { id: string; name: string; email: string; phone: string; role: string; theme?: "light" | "dark"; isEmailVerified?: boolean } | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; name: string; email: string; phone: string; role: string; theme?: "light" | "dark"; isEmailVerified?: boolean } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/check");
      if (response.ok) {
        const data = await response.json();

        if (data.user) {
          setUser(data.user);
        }
      } else {

      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
