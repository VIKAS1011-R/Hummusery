"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  useEffect(() => {
    // Check authentication status on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/check");
      if (response.ok) {
        const data = await response.json();
        console.log("Auth check response:", data);
        if (data.user) {
          setUser(data.user);
        }
      } else {
        console.log("Auth check failed with status:", response.status);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
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

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
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
