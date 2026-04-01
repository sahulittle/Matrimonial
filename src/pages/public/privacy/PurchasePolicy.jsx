import React from "react";
import Footer from "../home/Footer";
const PurchasePolicy = () => {
  return (
    <>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 mt-10">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 mt-12">
          Purchase Policy (Refund & Cancellation)
        </h1>

        {/* Intro */}
        <p className="mb-6 text-gray-700 leading-relaxed text-justify">
          This Purchase Policy outlines the terms related to payments,
          subscriptions, cancellations, and refunds for services offered by{" "}
          <strong>MarathiShubhavivah</strong>. By purchasing any paid service on
          our platform, you agree to the following terms.
        </p>

        {/* 1 */}
        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Paid Services</h2>
        <p className="text-gray-700 mb-2">
          MarathiShubhavivah may offer paid features such as:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Premium membership plans</li>
          <li>Profile highlighting or boosting</li>
          <li>Access to contact details of other users</li>
          <li>Additional matchmaking services</li>
        </ul>
        <p className="text-gray-700 mt-2">
          All paid services are optional and clearly described before purchase.
        </p>

        {/* 2 */}
        <h2 className="text-2xl font-semibold mt-6 mb-3">
          2. Pricing & Payments
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>
            All prices are displayed on the website and may change anytime
          </li>
          <li>
            Payments must be made through approved methods on the platform
          </li>
          <li>Users must provide accurate payment information</li>
        </ul>

        {/* 3 */}
        <h2 className="text-2xl font-semibold mt-6 mb-3">
          3. No Guarantee of Matches
        </h2>
        <p className="text-gray-700">
          Purchasing a plan does not guarantee matches, responses, or marriage
          outcomes. Paid services only improve visibility and access to platform
          features.
        </p>

        {/* 4 */}
        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Refund Policy</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>All payments are non-refundable</li>
          <li>No refunds once a plan is activated</li>
        </ul>

        <p className="text-gray-700 font-medium mt-3">
          Exceptions (if applicable):
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Payment deducted but service not activated</li>
          <li>Duplicate transactions</li>
        </ul>
        <p className="text-gray-700 mt-2">
          Refund requests must be made within <strong>7 days</strong> of the
          transaction.
        </p>

        {/* 5 */}
        <h2 className="text-2xl font-semibold mt-6 mb-3">
          5. Cancellation Policy
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Users can cancel subscriptions anytime</li>
          <li>Cancellation stops future renewals (if applicable)</li>
          <li>No refund for unused duration</li>
        </ul>

        {/* 6 */}
        <h2 className="text-2xl font-semibold mt-6 mb-3">
          6. Subscription Validity
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>Each plan is valid for a specific duration</li>
          <li>Services expire after the validity period</li>
          <li>Renewal is optional unless auto-renewal is enabled</li>
        </ul>

        {/* 7 */}
        <h2 className="text-2xl font-semibold mt-6 mb-3">
          7. Account Suspension Impact
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>No refund if account is suspended due to policy violation</li>
          <li>Access to paid services may be revoked immediately</li>
        </ul>

        {/* 8 */}
        <h2 className="text-2xl font-semibold mt-6 mb-3">8. Payment Issues</h2>
        <p className="text-gray-700">
          For failed transactions, delayed activation, or payment errors, users
          should contact support with transaction details.
        </p>

        {/* 9 */}
        <h2 className="text-2xl font-semibold mt-6 mb-3">
          9. Changes to Pricing & Plans
        </h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1">
          <li>We may modify pricing, plans, or features anytime</li>
          <li>New paid services may be introduced</li>
          <li>Changes will not affect existing active plans</li>
        </ul>

        {/* 10 */}
        <h2 className="text-2xl font-semibold mt-6 mb-3">10. Fraud & Misuse</h2>
        <p className="text-gray-700">
          Fraudulent payments or misuse may result in account suspension and
          legal action if required.
        </p>
      </div>
      <Footer/>
    </>
  );
};

export default PurchasePolicy;
