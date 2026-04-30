import React from 'react';

const CheckIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="10" fill="#FEE2EC" />
    <path
      d="M5.5 10.5L8.2 13.2L14.5 6.9"
      stroke="#ec4899"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function PricingSection() {
  const goldFeatures = [
    'Duration (1 Days)',
    'View 50 Contact Numbers',
    'Send Unlimited Interests',
    'Access to Basic Search Filters',
    'View Profile Visitors',
    'Priority Listing in Search (Basic Boost)',
    'Customer Support (Email/WhatsApp)'
  ];

  const diamondFeatures = [
    'Duration (2 Days)',
    'View 150 Contact Numbers',
    'Send Unlimited Interests & Messages',
    'Access to Advanced Search Filters',
    'See Who Viewed Your Profile',
    'Top Profile Listing (Higher visibility)',
    'Profile Highlight (Featured Tag)',
    'WhatsApp Match Alerts',
    'Dedicated Customer Support'
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Matrimonial Package</h2>
          <p className="mt-3 text-gray-600">
            Every user have their own package. Anyone can upgrade package or buy package through online payment system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Gold Card */}
          <div className="relative bg-white rounded-xl shadow-sm transform transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden">
            <div style={{ background: 'linear-gradient(90deg,#ec4899,#be185d)' }} className="h-2 w-full" />
            <div className="p-6 flex flex-col h-full">
              <div className="text-center">
                <h3 className="text-xl font-semibold">Gold</h3>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold" style={{ color: '#ec4899' }}>₹1</span>
                </div>
              </div>

              <ul className="mt-6 space-y-0 flex-1">
                {goldFeatures.map((f, idx) => (
                  <li key={idx} className={`flex items-start gap-4 py-3 ${idx !== 0 ? 'border-t' : ''} border-gray-100`}>
                    <div className="flex-shrink-0 mt-1">
                      <CheckIcon />
                    </div>
                    <p className="text-sm text-gray-700">{f}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-6 text-center">
                <button
                  className="inline-block bg-pink-500 hover:bg-pink-700 text-white rounded-md px-6 py-2 font-medium transition-colors"
                  style={{ backgroundColor: '#ec4899' }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Diamond Card */}
          <div className="relative bg-white rounded-xl shadow-sm transform transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden">
            <div style={{ background: 'linear-gradient(90deg,#ec4899,#be185d)' }} className="h-2 w-full" />
            <div className="p-6 flex flex-col h-full">
              <div className="text-center">
                <h3 className="text-xl font-semibold">Diamond</h3>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold" style={{ color: '#ec4899' }}>₹2</span>
                </div>
              </div>

              <ul className="mt-6 space-y-0 flex-1">
                {diamondFeatures.map((f, idx) => (
                  <li key={idx} className={`flex items-start gap-4 py-3 ${idx !== 0 ? 'border-t' : ''} border-gray-100`}>
                    <div className="flex-shrink-0 mt-1">
                      <CheckIcon />
                    </div>
                    <p className="text-sm text-gray-700">{f}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-6 text-center">
                <button
                  className="inline-block bg-pink-500 hover:bg-pink-700 text-white rounded-md px-6 py-2 font-medium transition-colors"
                  style={{ backgroundColor: '#ec4899' }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
