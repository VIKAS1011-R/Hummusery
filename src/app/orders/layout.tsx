import type { ReactNode } from "react";

export const metadata = {
  title: "Order History - Hummusery",
  description: "View your order history and track your past orders from Hummusery.",
  keywords: "order history, past orders, order tracking, hummusery",
};

export default function OrdersLayout({ children }: { children: ReactNode }) {
  return children;
}