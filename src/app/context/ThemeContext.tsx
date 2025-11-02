"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<Theme>("dark");
  const [loading, setLoading] = useState(true);

  // Apply dark theme immediately on mount to prevent flash
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const initializeTheme = useCallback(async () => {
    try {
      setLoading(true);

      if (user) {
        // If user is logged in, fetch their theme preference from the server
        const response = await fetch("/api/user/theme");
        if (response.ok) {
          const data = await response.json();
          if (data.theme) {
            setThemeState(data.theme);
            localStorage.setItem("theme", data.theme);
            applyTheme(data.theme);
            return;
          }
        }
      }

      // Fallback to localStorage or system preference
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("theme") as Theme;
        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
          setThemeState(savedTheme);
          applyTheme(savedTheme);
        } else {
          // Default to dark theme
          const defaultTheme: Theme = "dark";
          setThemeState(defaultTheme);
          localStorage.setItem("theme", defaultTheme);
          applyTheme(defaultTheme);
        }
      } else {
        // SSR fallback
        setThemeState("dark");
      }
    } catch (error) {
      console.error("Error initializing theme:", error);
      // Fallback to dark theme
      setThemeState("dark");
      applyTheme("dark");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Initialize theme from localStorage or user preference
    initializeTheme();
  }, [initializeTheme]);

  const applyTheme = (newTheme: Theme) => {
    if (typeof document === "undefined") return; // SSR safety check

    const root = document.documentElement;
    
    if (newTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);

      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
      }

      applyTheme(newTheme);

      // If user is logged in, save preference to server
      if (user) {
        await fetch("/api/user/theme", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ theme: newTheme }),
        });
      }
    } catch (error) {
      console.error("Error setting theme:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return a default context instead of throwing an error during SSR
    if (typeof window === "undefined") {
      return {
        theme: "dark" as Theme,
        setTheme: () => {},
        toggleTheme: () => {},
        loading: true,
      };
    }
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
