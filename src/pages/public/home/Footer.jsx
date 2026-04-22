import React from "react";
import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* 1st Div: About Us */}
          <div>
            <h4 className="text-2xl font-bold mb-6 text-pink-500">About Us</h4>
            <div className="text-gray-400 leading-relaxed">
              विदर्भ वैभव मंदिर यांच्या पुढाकारातून साकारलेले
              Marathishubhavivah.com हे केवळ एक डिजिटल प्लॅटफॉर्म नसून, आधुनिक
              युगातील समाजसेवेचे एक उज्ज्वल उदाहरण आहे.
              <span className="mt-4 px-3">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 transition text-sm"
                >
                  <span>Read more</span>
                  <span className="inline-flex items-center justify-center bg-pink-500 text-white rounded-full w-6 h-6">
                    <FaArrowRight className="text-xs" />
                  </span>
                </Link>
              </span>
            </div>
          </div>

          {/* 2nd Div: Quick Links */}
          <div>
            <h4 className="text-2xl font-bold mb-6 text-pink-500">
              Quick Links
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/stories"
                  className="hover:text-white transition-colors duration-300"
                >
                  Stories
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* 3rd Div: Policies */}
          <div>
            <h4 className="text-2xl font-bold mb-6 text-pink-500">Policies</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="hover:text-white transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/purchase-policy"
                  className="hover:text-white transition-colors duration-300"
                >
                  Purchase Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* 4th Div: Contact Us */}
          <div>
            <h4 className="text-2xl font-bold mb-6 text-pink-500">
              Contact Us
            </h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-pink-500" />
                <span>+917400472151</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-pink-500" />
                <span>jodi@marathishubhavivah.com</span>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-pink-500 mt-1" />
                <span>
                  401, Vaibhav Park, 64 Bhavani Shankar Rd, Dadar West, Mumbai
                  -400028,
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
