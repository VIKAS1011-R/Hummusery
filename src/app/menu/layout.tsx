import type { ReactNode } from "react";

export const metadata = {
  title: "Menu - Hummusery",
  description:
    "Explore our authentic Middle Eastern cuisine menu featuring fresh hummus, shawarma, falafel, and more delicious dishes.",
  keywords:
    "menu, middle eastern food, hummus, shawarma, falafel, restaurant, authentic cuisine",
};

export default function MenuLayout({ children }: { children: ReactNode }) {
  return children;
}
