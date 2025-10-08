import "./globals.css";
import type { ReactNode } from "react";
import { AuthProvider } from './context/AuthContext';

export const metadata = {
  title: "Hummusery",
  description: "Restaurant landing page",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-gray-900 text-white antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
