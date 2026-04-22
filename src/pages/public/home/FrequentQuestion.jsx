import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const FrequentQuestion = () => {
  const faqs = [
    {
      question: "What is MarathiShubhavivah.com for?",
      answer:
        "This platform is dedicated to helping individuals from the Maharashtrian community find suitable life partners based on culture, values, and preferences. This platform enables users to create detailed profiles, define their partner preferences, and discover suitable matches based on factors like age, religion, location, and interests. Designed for individuals seeking meaningful, long-term relationships, this site emphasizes compatibility, shared values, and cultural alignment. The site offers a secure and reliable space for users to connect, communicate, and explore potential life partners, making it easier to begin their journey toward marriage.",
    },
    {
      question: "Who can register on this website?",
      answer:
        "Anyone from the Maharashtrian community (Marathi-speaking or culturally connected) can register. Individuals can create profiles.",
    },
    {
      question: "Is registration free?",
      answer:
        "Yes, registration is completely free. You can create your profile and browse matches. Premium features are available through paid membership plans.",
    },
    {
      question: "What about the packages?",
      answer:
        "Marathi Shubhavivah provides a range of matrimonial packages tailored to suit different user requirements. From basic to premium options, each plan includes features such as advanced search filters, unlimited messaging, and enhanced profile visibility. These packages are designed to improve your matchmaking experience and help you find the right partner with ease.",
    },
    {
      question: "What details are required to create a profile?",
      answer:
        "You need to provide basic details such as: Name, Age, Gender; Religion, Caste (if applicable); Education & Profession; Location; Partner Preferences. Adding complete details improves your chances of finding the right match.",
    },
    {
      question: "How will I find a partner?",
      answer:
        "To find a partner on Marathi Shubhavivah, begin by creating a complete and engaging profile that highlights your interests, preferences, and relationship goals. You can then browse and search profiles using filters such as age, location, and values to find suitable matches. When you come across someone you like, send an interest or message to initiate a conversation. Take time to communicate and understand each other. If both of you feel a connection, you can proceed to meet and discuss the next steps. Marathi Shubhavivah provides a safe and trusted platform to help you build genuine connections and find the right partner.",
    },
    {
      question: "Can I search profiles based on caste or community?",
      answer:
        "Yes, you can filter profiles based on Maharashtrian castes, sub-castes, and communities as per your preferences.",
    },
    {
      question: "Is my personal information safe?",
      answer:
        "Yes, your data is completely secure. We follow strict privacy policies, and you have full control over what information is visible to others.",
    },
    {
      question: "How can I contact a match?",
      answer:
        "You can send an 'Interest' to a profile. Once accepted, you can connect via chat or view contact details (for premium users).",
    },
    {
      question: "What are the benefits of premium membership?",
      answer:
        "Premium members can: View contact details; Send unlimited interests; Access advanced search filters; Get better visibility in search results.",
    },
    {
      question: "Can parents create profiles for their children?",
      answer:
        "No, parents or guardians can't create and manage profiles on behalf of their children.",
    },
    {
      question: "How do I verify profiles?",
      answer:
        "Our admin team reviews profiles before approval. You can also check profile details and communicate before proceeding further.",
    },
    {
      question: "Can I edit or update my profile later?",
      answer:
        "Yes, you can update your profile anytime to keep your information accurate and relevant.",
    },
    {
      question: "What if I find inappropriate profiles or behavior?",
      answer:
        "You can report or block any profile. Our team will take immediate action to ensure a safe environment.",
    },
    {
      question: "Is this platform only for Maharashtra residents?",
      answer:
        "No, it is for Maharashtrians across India and globally who wish to find a match within their community.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "You can request account deletion from your profile settings or contact our support team for assistance.",
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
