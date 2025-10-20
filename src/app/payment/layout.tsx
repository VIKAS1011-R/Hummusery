import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment - Hummusery",
  description: "Complete your order payment",
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}