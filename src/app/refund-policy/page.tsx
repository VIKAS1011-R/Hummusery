"use client";

import React from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function RefundPolicyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Refund & Cancellation Policy
          </h1>
          
          <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last Updated: November 9, 2025
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Order Cancellation</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Regular Orders</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Orders can be cancelled within 5 minutes of placement for a full refund</li>
                <li>After 5 minutes, cancellation depends on order preparation status</li>
                <li>If preparation has started, cancellation may not be possible</li>
                <li>Cancellation requests must be made through your account or by calling us</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-4">Party Orders & Bulk Catering</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cancellation allowed up to 24 hours before scheduled delivery/pickup</li>
                <li>Cancellations within 24 hours may incur a 25% cancellation fee</li>
                <li>Cancellations within 6 hours may incur a 50% cancellation fee</li>
                <li>No refund for cancellations within 2 hours of scheduled time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Refund Eligibility</h2>
              <p>You are eligible for a refund in the following cases:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Order cancelled within the allowed timeframe</li>
                <li>Wrong item delivered</li>
                <li>Food quality issues (spoiled, contaminated, or inedible)</li>
                <li>Missing items from your order</li>
                <li>Significant delay in delivery (over 60 minutes from estimated time)</li>
                <li>Restaurant unable to fulfill the order</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Refund Process</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refund requests must be made within 24 hours of order delivery</li>
                <li>Contact us via email or phone with your order details</li>
                <li>Provide photos for quality-related issues</li>
                <li>Refunds will be processed to the original payment method</li>
                <li>Processing time: 5-7 business days for cards, 1-2 days for UPI/wallets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Partial Refunds</h2>
              <p>Partial refunds may be issued for:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Missing items (refund for missing items only)</li>
                <li>Quality issues with specific items</li>
                <li>Late delivery (delivery charges refunded)</li>
                <li>Incorrect customizations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Non-Refundable Situations</h2>
              <p>Refunds will not be provided for:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Change of mind after order confirmation</li>
                <li>Incorrect address provided by customer</li>
                <li>Customer unavailable for delivery</li>
                <li>Taste preferences (unless food is inedible)</li>
                <li>Delays due to weather or circumstances beyond our control</li>
                <li>Orders consumed partially or completely</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Alternative Resolutions</h2>
              <p>Instead of refunds, we may offer:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Store credit for future orders</li>
                <li>Replacement items</li>
                <li>Discount on next order</li>
                <li>Complimentary items</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Payment Gateway Refunds</h2>
              <p>
                All refunds are processed through Razorpay, our secure payment gateway. The refund timeline depends on your bank or payment provider:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Credit Cards: 5-7 business days</li>
                <li>Debit Cards: 5-7 business days</li>
                <li>Net Banking: 5-7 business days</li>
                <li>UPI: 1-2 business days</li>
                <li>Wallets (Paytm, PhonePe, etc.): 1-2 business days</li>
              </ul>
              <p className="mt-2">
                Once we initiate the refund, you will receive a confirmation email. Please allow the specified time for the amount to reflect in your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Dispute Resolution</h2>
              <p>
                If you&apos;re not satisfied with our refund decision, you can:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Escalate the issue to our management team</li>
                <li>Contact Razorpay customer support for payment-related disputes</li>
                <li>Approach consumer forums as per Indian consumer protection laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Contact for Refunds</h2>
              <p>
                To request a refund or cancellation:
              </p>
              <ul className="list-none space-y-1 mt-2">
                <li><strong>Email:</strong> hummusery1@gmail.com</li>
                <li><strong>Phone:</strong> +91-74839 39713</li>
                <li><strong>Business Hours:</strong> 10:00 AM - 10:00 PM (All days)</li>
                <li className="mt-2"><strong>Include:</strong> Order ID, reason for refund, and supporting photos if applicable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Policy Updates</h2>
              <p>
                This policy may be updated from time to time. Changes will be effective immediately upon posting on our website. We recommend reviewing this policy periodically.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
