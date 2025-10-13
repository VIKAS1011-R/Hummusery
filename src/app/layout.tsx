import "./globals.css";
import type { ReactNode } from "react";
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import ToastContainer from './components/ToastContainer';
import DatabaseWarmup from './components/DatabaseWarmup';
import ConnectionMonitor from './components/ConnectionMonitor';

export const metadata = {
  title: "Hummusery",
  description: "Restaurant landing page",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-900 text-white antialiased">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <DatabaseWarmup />
              {children}
              <ToastContainer />
              <ConnectionMonitor />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
