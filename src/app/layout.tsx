import "./globals.css";
import type { ReactNode } from "react";
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import ToastContainer from './components/ToastContainer';

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
              {children}
              <ToastContainer />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
