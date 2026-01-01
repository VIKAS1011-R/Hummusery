"use client";

import React from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Terms and Conditions
          </h1>
          
          <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last Updated: November 9, 2025
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Hummusery&apos;s website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Services</h2>
              <p>
                Hummusery provides online food ordering and delivery services. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Orders and Payment</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All orders are subject to acceptance and availability</li>
                <li>Prices are in Indian Rupees (INR) and include applicable taxes</li>
                <li>Payment must be completed at the time of order placement</li>
                <li>We accept payments through Razorpay (Credit/Debit Cards, UPI, Net Banking, Wallets)</li>
                <li>All transactions are secure and encrypted</li>
                <li>Order confirmation will be sent via email after successful payment</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Party Orders & Bulk Catering</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Party orders require advance notice as specified for each item</li>
                <li>Minimum order quantities apply for bulk items</li>
                <li>Customization requests are subject to availability and additional charges</li>
                <li>Cancellation policies for party orders may differ from regular orders</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Delivery</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delivery times are estimates and may vary based on location and order volume</li>
                <li>Delivery charges may apply based on location</li>
                <li>We are not responsible for delays caused by circumstances beyond our control</li>
                <li>You must be available to receive the order at the specified address</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. User Accounts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for all activities under your account</li>
                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Food Safety and Allergies</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We take food safety seriously and follow all applicable regulations</li>
                <li>Allergen information is provided for guidance only</li>
                <li>Please inform us of any allergies or dietary restrictions</li>
                <li>We cannot guarantee complete absence of allergens due to shared kitchen facilities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, and images, is the property of Hummusery and protected by copyright laws. You may not reproduce, distribute, or use any content without our written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Limitation of Liability</h2>
              <p>
                Hummusery shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services or products. Our liability is limited to the amount paid for the specific order in question.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Contact Information</h2>
              <p>
                For questions about these terms, please contact us at:
              </p>
              <ul className="list-none space-y-1 mt-2">
                <li>Email: hummusery1@gmail.com</li>
                <li>Phone: 74839 39713</li>
                <li>Address: Shop 150, 1st Main Rd, near christ university, Amaravathi Layout, HMT Layout, Bengaluru, Karnataka 560073</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
