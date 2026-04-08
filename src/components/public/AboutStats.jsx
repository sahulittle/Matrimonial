import React from "react";

const AboutStats = ({ stats = [] }) => {
  if (!stats.length) return null;

  return (
    <div className="px-6 lg:px-10 py-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-pink-50 rounded-lg p-6 shadow-sm flex flex-col items-center justify-center"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-pink-600">
                {s.value}
              </div>
              <div className="mt-2 text-gray-700">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutStats;
