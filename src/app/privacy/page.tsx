"use client";

import React from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last Updated: November 9, 2025
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
              <p>We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, delivery address</li>
                <li><strong>Payment Information:</strong> Processed securely through Razorpay (we do not store card details)</li>
                <li><strong>Order Information:</strong> Order history, preferences, and feedback</li>
                <li><strong>Technical Information:</strong> IP address, browser type, device information, cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders</li>
                <li>Send order confirmations and updates</li>
                <li>Improve our services and user experience</li>
                <li>Send promotional offers (with your consent)</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Information Sharing</h2>
              <p>We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Payment Processors:</strong> Razorpay for processing payments</li>
                <li><strong>Delivery Partners:</strong> For order fulfillment</li>
                <li><strong>Service Providers:</strong> Who assist in operating our website</li>
                <li><strong>Legal Authorities:</strong> When required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information. All payment transactions are processed through Razorpay&apos;s secure payment gateway using industry-standard encryption.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Cookies</h2>
              <p>
                We use cookies to enhance your experience, remember your preferences, and analyze website traffic. You can control cookie settings through your browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Order history is retained for accounting and legal purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Children&apos;s Privacy</h2>
              <p>
                Our services are not intended for children under 18. We do not knowingly collect information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Changes to Privacy Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Contact Us</h2>
              <p>
                For privacy-related questions or to exercise your rights, contact us at:
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
