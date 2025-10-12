import type { ReactNode } from "react";

export const metadata = {
  title: "Shopping Cart - Hummusery",
  description: "Review your order and proceed to checkout. Delicious Middle Eastern cuisine awaits!",
  keywords: "cart, checkout, order, middle eastern food, hummus, dine-in",
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return children;
}