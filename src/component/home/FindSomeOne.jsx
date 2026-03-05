import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaLink, FaComments } from 'react-icons/fa';

const FindSomeOne = () => {
  const steps = [
    {
      icon: <FaUserPlus size={40} />,
      title: "Sign Up",
      description: "Register for free & put up your Matrimony Profile",
      link: "/signup",
    },
    {
      icon: <FaLink size={40} />,
      title: "Connect",
      description: "Select & Connect with Matches you like",
    },
    {
      icon: <FaComments size={40} />,
      title: "Interact",
      description: "Become a Premium Member & Start a Conversation",
    },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Find your Special Someone
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {step.link ? (
                <Link to={step.link} className="block group">
                  <div className="relative inline-block mb-6">
                    <div className="w-28 h-28 mx-auto flex items-center justify-center bg-pink-100 rounded-full text-pink-500 shadow-lg group-hover:bg-pink-200 transition-colors">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 h-10 w-10 flex items-center justify-center bg-pink-500 text-white font-bold text-xl rounded-full border-4 border-gray-50">
                      {index + 1}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2 uppercase group-hover:text-pink-600 transition-colors">{step.title}</h4>
                  <p className="text-gray-600 max-w-xs mx-auto">{step.description}</p>
                </Link>
              ) : (
                <>
                  <div className="relative inline-block mb-6">
                    <div className="w-28 h-28 mx-auto flex items-center justify-center bg-pink-100 rounded-full text-pink-500 shadow-lg">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 h-10 w-10 flex items-center justify-center bg-pink-500 text-white font-bold text-xl rounded-full border-4 border-gray-50">
                      {index + 1}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2 uppercase">{step.title}</h4>
                  <p className="text-gray-600 max-w-xs mx-auto">{step.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindSomeOne;