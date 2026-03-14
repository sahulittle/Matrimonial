import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const FrequentQuestion = () => {
  const faqs = [
    {
      question: "What is a matrimonial site?",
      answer: "A matrimonial site is an online platform designed to help individuals find a life partner for marriage. These sites allow users to create personal profiles, specify their preferences, and search for compatible matches based on various criteria such as age, religion, location, and interests. Matrimonial sites typically cater to people seeking serious, long-term relationships, often focusing on compatibility and shared values. They provide a safe and secure environment for individuals to connect, communicate, and explore potential partnerships, helping them take the first step towards marriage."
    },
    {
      question: "What is 'Our Stories'?",
      answer: "Our Stories\" section on Matrilab showcases real-life success stories of couples who found their perfect match through our platform. These heartfelt stories highlight how our users met, overcame challenges, and built lasting relationships. It’s a place for inspiration, offering a glimpse into the journey of love and connection that begins on Matrilab. By sharing these experiences, we hope to encourage and motivate others to trust the process and find their own happy ending. Each story is unique, reflecting the diverse ways love can unfold."
    },
    {
      question: "What about the packages?",
      answer: "Matrilab offers various matrimonial packages designed to meet different user needs. Packages range from basic to premium, offering features like advanced search filters, unlimited messaging, and profile visibility. Each package is tailored to enhance your matchmaking experience, ensuring you find the perfect partner with ease."
    },
    {
      question: "Is it age-restricted?",
      answer: "Matrilab is designed for individuals above the legal age of marriage, typically 18 years or older, to ensure users are mature enough to engage in meaningful relationships. We recommend that users are of legal age in their respective countries or regions before signing up. The platform aims to foster responsible matchmaking, focusing on connecting individuals who are ready for serious commitments. Age verification is part of the registration process to maintain a safe and appropriate environment for all users."
    },
    {
      question: "How does it work?",
      answer: "MatriLab makes finding your ideal partner easy and efficient with a simple three-step process. First, create an account by filling out a detailed profile that includes your preferences and relationship goals. Next, search for your partner using our advanced filters based on your ideal criteria, such as age, interests, and values. Finally, start communication with potential matches through our secure messaging system. Once you find someone you connect with, you can take your relationship further at your own pace. MatriLab guides you every step of the way to ensure a smooth and successful matchmaking experience."
    },
    {
      question: "How will I find a partner?",
      answer: "To find a partner on Matrilab, start by creating a detailed profile, highlighting your interests, preferences, and relationship goals. After that, you can explore and search through the available profiles using filters like age, location, and values. Once you find someone you're interested in, you can send a connection request or message to start a conversation. Communication is key, so take your time getting to know each other. If you both feel a connection, you can move forward with meeting and discussing the next steps. Matrilab helps facilitate secure and genuine connections to find the perfect partner."
    },
    {
      question: "How do I purchase packages?",
      answer: "To purchase a matrimonial package on Matrilab, simply sign up or log in to your account. Once logged in, navigate to the \"Matrimonial Packages\" section, where you'll find a variety of packages tailored to your needs. Select the package that suits you best, and click on \"Buy Now.\" You'll be prompted to enter your payment details securely. After completing the payment, your package will be activated, and you can start using premium features right away. If you need assistance, our support team is available to help."
    },
    {
      question: "What about your services?",
      answer: "Matrilab offers a comprehensive matchmaking platform that connects individuals seeking serious relationships. We provide personalized matrimonial packages to suit different needs, from basic to premium options. Our services include detailed profile creation, compatibility matching, and secure communication channels to ensure you can interact with potential partners comfortably. Additionally, we offer verified member profiles, so you can trust that the connections are genuine. Whether you're looking for love or marriage, our platform guides you every step of the way."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our FAQ section to help guide you through the process of using Matrilab effectively.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left py-5 px-2 focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                <span className="text-pink-500">
                  {openIndex === index ? <FaMinus size={20} /> : <FaPlus size={20} />}
                </span>
              </button>
              <div
                className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
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
}

export default FrequentQuestion