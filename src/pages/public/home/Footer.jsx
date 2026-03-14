import React from 'react'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* 1st Div: About Us */}
          <div>
            <h4 className="text-2xl font-bold mb-6 text-pink-500">About Us</h4>
            <p className="text-gray-400 leading-relaxed">
              Our platform is designed to be flexible for both men and women. In today’s world, you can confidently choose your partner and feel comfortable at every step.
            </p>
          </div>

          {/* 2nd Div: Quick Links */}
          <div>
            <h4 className="text-2xl font-bold mb-6 text-pink-500">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Stories</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Contact</a></li>
            </ul>
          </div>

          {/* 3rd Div: Policies */}
          <div>
            <h4 className="text-2xl font-bold mb-6 text-pink-500">Policies</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Purchase Policy</a></li>
            </ul>
          </div>

          {/* 4th Div: Contact Us */}
          <div>
            <h4 className="text-2xl font-bold mb-6 text-pink-500">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-pink-500" />
                <span>+ (001) 001 001</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-pink-500" />
                <span>test@site.com</span>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-pink-500 mt-1" />
                <span>4517 Washington Ave. Kentucky</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer