import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const FrequentQuestion = () => {
  const faqs = [
    {
      question:
        "01 Why is Marathi Shubha Vivah better compared to other matrimonial websites?",
      answer:
        "Marathi Shubha Vivah stands out as a trusted matchmaking platform focused on authenticity and meaningful connections. Unlike many traditional matrimonial sites, Marathi Shubha Vivah emphasizes verified profiles, personalized matchmaking, and tools that help users find compatible partners with ease and confidence. Our commitment to safety, privacy, and genuine success stories makes the platform a preferred choice for many users.",
    },
    {
      question:
        "02 Is Marathi Shubha Vivah a trustworthy matchmaking platform?",
      answer:
        "Yes — Marathi Shubha Vivah follows strong verification and security practices to ensure a reliable experience. With profile verification, privacy controls, and attentive support, we prioritize user safety and authenticity. Our processes and features are designed to offer a modern, trustworthy, and personalized approach to finding a compatible life partner.",
    },
    {
      question:
        "03 What is the difference between free membership vs paid membership?",
      answer:
        "A Free Membership lets you create a profile, browse public profiles, and use basic search filters. Paid Membership unlocks more powerful features — advanced search filters, the ability to initiate and respond to messages, view contact details (depending on privacy settings), priority support, and profile boosts that increase visibility. Paid plans are tailored to help serious seekers move faster and with better results.",
    },
    {
      question: "04 What additional benefits do I get as a Premium Member?",
      answer:
        "Premium members enjoy advanced search filters, priority customer support, profile boosts, and access (where permitted) to contact information of interested members. These benefits help you connect more easily with compatible matches and speed up the process of finding the right partner.",
    },
    {
      question: "05 How can I contact other members on Marathi Shubha Vivah?",
      answer:
        "With a premium membership you can chat and (where supported) use voice/video calling within the app. Depending on privacy and membership levels, you may also access contact details of interested members to take conversations forward. Always follow our safety guidelines when connecting with others.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our FAQ section to help guide you through using Marathi
            Shubha Vivah effectively.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left py-5 px-2 focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                <span className="text-pink-500">
                  {openIndex === index ? (
                    <FaMinus size={20} />
                  ) : (
                    <FaPlus size={20} />
                  )}
                </span>
              </button>
              <div
                className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pb-5 px-2 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FrequentQuestion;
