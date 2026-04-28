import React, { useState, useEffect, useRef } from "react";
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
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // refs for scroll tracking — do NOT use state for scroll position
  const prevScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);
  const latestScrollY = useRef(prevScrollY.current);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      latestScrollY.current = window.scrollY;

      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          const current = latestScrollY.current;
          const previous = prevScrollY.current;

          if (current > previous && current > 80) {
            setIsTopNavVisible(false);
          } else if (current < previous) {
            setIsTopNavVisible(true);
          }

          prevScrollY.current = current;
          ticking.current = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-white shadow-md">
      <nav
        className={`flex flex-col md:flex-row items-center justify-between px-4 md:px-10 text-sm text-gray-700 bg-gray-100 transition-transform transition-opacity duration-300 ease-in-out transform py-2.5 border-b border-gray-300 ${
          isTopNavVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        {/* Left Side: Contact Info */}
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-6 mb-2 md:mb-0">
          <a
            href="mailto:info@marathishubhavivah.com"
            className="flex items-center gap-2 transition-colors hover:text-pink-600"
          >
            <FaEnvelope className="text-pink-500" />
            <span>jodi@marathishubhavivah.com</span>
          </a>
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-pink-500" />
            <span>+917400472151</span>
          </div>
        </div>

        {/* Right Side: Social Icons */}
        <div className="flex items-center gap-5">
          <a href="#" className="transition-colors hover:text-pink-600">
            <FaFacebookF />
          </a>
          <a href="#" className="transition-colors hover:text-pink-600">
            <FaTwitter />
          </a>
          <a href="#" className="transition-colors hover:text-pink-600">
            <FaInstagram />
          </a>
          <a href="#" className="transition-colors hover:text-pink-600">
            <FaLinkedinIn />
          </a>
        </div>
      </nav>
      <nav className="flex items-center justify-between px-4 md:px-10 py-3 bg-white relative">
        {/* Left Side: Logo and Brand Name */}
        <div className="flex ml-8 lg:ml-10">
          <img
            src="/logo-rmbg.png"
            alt="MatriLab Logo"
            className="h-12 object-contain scale-150"
          />
        </div>

        {/* Center: Navigation Links */}
        <ul className="hidden lg:flex items-center gap-8 text-base font-medium text-gray-600">
          <li>
            <Link to="/" className="transition hover:text-pink-600">
              Home
            </Link>
          </li>
          <li className="relative group">
            <span className="cursor-pointer transition hover:text-pink-600">
              About
            </span>

            {/* Dropdown */}
            <ul className="absolute left-0 mt-2 w-52 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <li>
                <Link to="/about" className="block px-4 py-2 hover:bg-gray-100">
                  About MSV
                </Link>
              </li>

              <li>
                <Link
                  to="/committee-members"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Committee Members
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/packages" className="transition hover:text-pink-600">
              Packages
            </Link>
          </li>
          <li>
            <Link to="/our-projects" className="transition hover:text-pink-600">
              Our Projects
            </Link>
          </li>
          {/* <li><Link to="/members" className="transition hover:text-pink-600">Members</Link></li> */}
          <li>
            <Link to="/stories" className="transition hover:text-pink-600">
              Stories
            </Link>
          </li>
          <li>
            <Link to="/contact" className="transition hover:text-pink-600">
              Contact
            </Link>
          </li>
        </ul>

        {/* Right Side: Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-semibold text-gray-700 transition rounded-full hover:text-pink-600"
          >
            Login
          </Link>
          <Link
            to="/register"
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
            <ul className="flex flex-col items-center gap-5 text-base font-medium text-gray-600 w-full">
              <li>
                <Link
                  to="/"
                  className="transition hover:text-pink-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li className="w-full text-center">
                <button
                  onClick={() => setIsAboutOpen(!isAboutOpen)}
                  className="w-full py-2 hover:text-pink-600"
                >
                  About Us
                </button>

                {isAboutOpen && (
                  <ul className="flex flex-col items-center bg-gray-50 w-full">
                    <li>
                      <Link
                        to="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 text-sm"
                      >
                        About
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/committee-members"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 text-sm"
                      >
                        Committee Members
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link
                  to="/packages"
                  className="transition hover:text-pink-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Packages
                </Link>
              </li>
              <li>
                <Link
                  to="/our-projects"
                  className="transition hover:text-pink-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Projects
                </Link>
              </li>
              {/* <li><Link to="/members" className="transition hover:text-pink-600" onClick={() => setIsMobileMenuOpen(false)}>Members</Link></li> */}
              <li>
                <Link
                  to="/stories"
                  className="transition hover:text-pink-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Stories
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition hover:text-pink-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
            <div className="flex flex-col items-center gap-3 w-full px-6">
              <Link
                to="/login"
                className="w-full text-center px-5 py-2 text-sm font-semibold text-gray-700 transition rounded-full border border-gray-300 hover:text-pink-600 hover:border-pink-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
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
