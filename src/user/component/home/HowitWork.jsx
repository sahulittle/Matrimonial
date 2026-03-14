import React from "react";
import { FaUserPlus, FaSearch, FaEnvelopeOpenText } from "react-icons/fa";

const HowitWork = () => {
    const steps = [
        {
            icon: <FaUserPlus />,
            title: "Create Account",
            description: "Register quickly, set up your profile, and personalize preferences.",
        },
        {
            icon: <FaSearch />,
            title: "Search Your Partner",
            description: "Explore profiles, apply filters, and find your perfect match.",
        },
        {
            icon: <FaEnvelopeOpenText />,
            title: "Start Communication",
            description: "Send messages, interact, and build a meaningful relationship easily.",
        },
    ];

    return (
        <div
            className="relative py-16 bg-contain bg-center bg-fixed"
            style={{ backgroundImage: "url('https://dhatriphotography.weebly.com/uploads/1/3/6/6/136623161/wedding-album-design_orig.jpeg')" }}
        >
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10 container mx-auto px-6 text-center">
                <h3 className="text-4xl font-bold text-white mb-4">How It Works</h3>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-5">
                    This platform helps you find your dream partner through a simple
                    step-by-step process. Whether you're looking for a life partner or
                    want to become one, follow our recommended steps to make the perfect
                    match.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {steps.map((step, index) => (
                        <div key={index} className=" flex items-center justify-center p-8 rounded-xl text-white gap-8">
                            <div className="text-pink-400 text-4xl mx-auto mb-6 flex justify-center h-16 w-24 rounded-full items-center bg-white border-3 border-dashed">
                                {step.icon}
                            </div>
                            <div className="text-left">
                                <h4 className="text-xl font-bold mb-2 uppercase tracking-wider">
                                    {step.title}
                                </h4>
                                <p className="text-gray-300">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HowitWork;