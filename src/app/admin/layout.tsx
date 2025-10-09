import type { ReactNode } from "react";

export const metadata = {
  title: "Admin Dashboard - Hummusery",
  description: "Restaurant admin dashboard for order management",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900">
      {children}
    </div>
  );
}