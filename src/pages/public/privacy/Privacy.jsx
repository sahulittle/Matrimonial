import React from "react";

const Privacy = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 mt-12">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6 mt-12">Privacy Policy</h1>

      {/* Intro */}
      <p className="mb-6 text-gray-700 leading-relaxed text-justify">
        Welcome to <strong>MarathiShubhavivah</strong>. We value your trust and
        are committed to protecting your privacy. This Privacy Policy explains
        how we collect, use, share, and safeguard your personal information when
        you use our website and services. By accessing or using our platform,
        you agree to the terms outlined in this Privacy Policy.
      </p>

      {/* Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">
        1. Information We Collect
      </h2>

      <p className="font-medium">a. Personal Information</p>
      <ul className="list-disc pl-6 space-y-1 text-gray-700">
        <li>Full name</li>
        <li>Email address</li>
        <li>Mobile number</li>
        <li>Gender</li>
        <li>Date of birth</li>
        <li>Marital status</li>
        <li>Location (city, state, country)</li>
        <li>Education and profession</li>
        <li>Photos and profile details</li>
      </ul>

      <p className="font-medium mt-4">b. Sensitive Personal Information</p>
      <ul className="list-disc pl-6 space-y-1 text-gray-700">
        <li>Religion</li>
        <li>Caste / community</li>
        <li>Marriage preferences</li>
      </ul>
      <p className="text-gray-700 mt-2">
        This information is collected only with your consent.
      </p>

      <p className="font-medium mt-4">c. Technical Information</p>
      <ul className="list-disc pl-6 space-y-1 text-gray-700">
        <li>IP address</li>
        <li>Browser type</li>
        <li>Device details</li>
        <li>Pages visited and usage behavior</li>
        <li>Cookies and tracking data</li>
      </ul>

      {/* Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc pl-6 space-y-1 text-gray-700">
        <li>Create and manage your account</li>
        <li>Provide matchmaking services</li>
        <li>Display your profile to other users</li>
        <li>Improve website experience</li>
        <li>Send updates, offers, and support</li>
        <li>Ensure security and prevent fraud</li>
      </ul>

      {/* Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">
        3. Profile Visibility
      </h2>
      <p className="text-gray-700">
        Your profile may be visible to other registered users. Information like
        name, age, location, and preferences may be displayed. You can control
        visibility from your account settings.
      </p>

      {/* Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">
        4. Sharing of Information
      </h2>
      <p className="text-gray-700">
        We may share data with users, trusted service providers, or legal
        authorities if required. We never sell your personal information.
      </p>

      {/* Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">5. Cookies</h2>
      <p className="text-gray-700">
        Cookies help improve your experience. You can disable them in browser
        settings.
      </p>

      {/* Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">6. Data Security</h2>
      <p className="text-gray-700">
        We use secure systems and restricted access to protect your data, but no
        system is 100% secure.
      </p>

      {/* Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">7. Your Rights</h2>
      <ul className="list-disc pl-6 space-y-1 text-gray-700">
        <li>Access your data</li>
        <li>Update or correct information</li>
        <li>Delete your account</li>
        <li>Withdraw consent</li>
      </ul>

      {/* Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">8. Account Deletion</h2>
      <p className="text-gray-700">
        You can delete your account anytime. Some data may be retained for legal
        or security reasons.
      </p>

      {/* Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">9. Safety Disclaimer</h2>
      <p className="text-gray-700">
        We do not guarantee accuracy of profiles. Users must verify details
        independently. All interactions are at your own risk.
      </p>

      {/* Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">10. Fraud Prevention</h2>
      <p className="text-gray-700">
        Fake profiles, scams, or misuse are strictly prohibited. Accounts may be
        suspended.
      </p>

      {/* Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">
        11. Safety Guidelines
      </h2>
      <ul className="list-disc pl-6 space-y-1 text-gray-700">
        <li>Meet in public places</li>
        <li>Inform family before meeting</li>
        <li>Avoid sharing sensitive info early</li>
      </ul>

      {/* Section */}
      <h2 className="text-2xl font-semibold mt-6 mb-3">
        12. Changes to Policy
      </h2>
      <p className="text-gray-700">
        We may update this policy anytime. Changes will be posted on this page.
      </p>
    </div>
  );
};

export default Privacy;
