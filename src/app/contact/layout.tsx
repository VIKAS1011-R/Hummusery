import type { ReactNode } from "react";

export const metadata = {
  title: "Contact Us - Hummusery",
  description: "Get in touch with Hummusery. Visit our restaurant, call us, or send us a message. We're here to serve you the best Middle Eastern cuisine.",
  keywords: "contact, restaurant, middle eastern food, hummus, location, phone, email",
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}