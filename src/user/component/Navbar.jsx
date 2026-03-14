import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = () => {
  const [isTopNavVisible, setIsTopNavVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    // A threshold to prevent hiding on small scrolls
    const threshold = 80;

    // Hide top nav when scrolling down past the threshold
    if (currentScrollY > lastScrollY && currentScrollY > threshold) {
      setIsTopNavVisible(false);
    } else {
      // Show top nav when scrolling up
      setIsTopNavVisible(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <nav
        className={`flex flex-col md:flex-row items-center justify-between px-4 md:px-10 text-sm text-gray-700 bg-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
          isTopNavVisible
            ? "py-2.5 border-b border-gray-300 max-h-24 md:max-h-12"
            : "py-0 border-b-0 max-h-0"
        }`}
      >
        {/* Left Side: Contact Info */}
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-6 mb-2 md:mb-0">
          <a
            href="mailto:info@matrilab.com"
            className="flex items-center gap-2 transition-colors hover:text-pink-600"
          >
            <FaEnvelope className="text-pink-500" />
            <span>info@matrilab.com</span>
          </a>
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-pink-500" />
            <span>+1 234 567 890</span>
          </div>
        </div>

        {/* Right Side: Social Icons */}
        <div className="flex items-center gap-5">
          <a href="#" className="transition-colors hover:text-pink-600"><FaFacebookF /></a>
          <a href="#" className="transition-colors hover:text-pink-600"><FaTwitter /></a>
          <a href="#" className="transition-colors hover:text-pink-600"><FaInstagram /></a>
          <a href="#" className="transition-colors hover:text-pink-600"><FaLinkedinIn /></a>
        </div>
      </nav>
      <nav className="flex items-center justify-between px-4 md:px-10 py-3 bg-white relative">
        {/* Left Side: Logo and Brand Name */}
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <div className="text-2xl font-bold text-gray-800">MatriLab</div>
        </div>

        {/* Center: Navigation Links */}
        <ul className="hidden lg:flex items-center gap-8 text-base font-medium text-gray-600">
          <li><Link to="/" className="transition hover:text-pink-600">Home</Link></li>
          <li><Link to="/packages" className="transition hover:text-pink-600">Packages</Link></li>
          {/* <li><Link to="/members" className="transition hover:text-pink-600">Members</Link></li> */}
          <li><Link to="/stories" className="transition hover:text-pink-600">Stories</Link></li>
          <li><Link to="/contact" className="transition hover:text-pink-600">Contact</Link></li>
        </ul>

        {/* Right Side: Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/login"
            className="px-5 py-2 text-sm font-semibold text-gray-700 transition rounded-full hover:text-pink-600"
          >
            Login
          </Link>
          <Link to="/register"
            className="px-5 py-2 text-sm font-semibold text-white bg-pink-500 rounded-full shadow-md transition hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
            className="lg:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg flex flex-col items-center py-6 gap-6 lg:hidden border-t border-gray-100">
                <ul className="flex flex-col items-center gap-4 text-base font-medium text-gray-600 w-full">
                    <li><Link to="/" className="transition hover:text-pink-600" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
                    <li><Link to="/packages" className="transition hover:text-pink-600" onClick={() => setIsMobileMenuOpen(false)}>Packages</Link></li>
                    {/* <li><Link to="/members" className="transition hover:text-pink-600" onClick={() => setIsMobileMenuOpen(false)}>Members</Link></li> */}
                    <li><Link to="/stories" className="transition hover:text-pink-600" onClick={() => setIsMobileMenuOpen(false)}>Stories</Link></li>
                    <li><Link to="/contact" className="transition hover:text-pink-600" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link></li>
                </ul>
                <div className="flex flex-col items-center gap-3 w-full px-6">
                    <Link to="/login"
                        className="w-full text-center px-5 py-2 text-sm font-semibold text-gray-700 transition rounded-full border border-gray-300 hover:text-pink-600 hover:border-pink-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Login
                    </Link>
                    <Link to="/register"
                        className="w-full text-center px-5 py-2 text-sm font-semibold text-white bg-pink-500 rounded-full shadow-md transition hover:bg-pink-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Register
                    </Link>
                </div>
            </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;