import "./globals.css";
import type { ReactNode } from "react";
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import ToastContainer from './components/ToastContainer';
import DatabaseWarmup from './components/DatabaseWarmup';
import ConnectionMonitor from './components/ConnectionMonitor';

export const metadata = {
  title: "Hummusery",
  description: "Restaurant landing page",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="antialiased transition-colors">
        <ToastProvider>
          <AuthProvider>
            <ThemeProvider>
              <CartProvider>
                <DatabaseWarmup />
                {children}
                <ToastContainer />
                <ConnectionMonitor />
              </CartProvider>
            </ThemeProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
