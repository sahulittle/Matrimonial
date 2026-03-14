import React from "react";
import {
  FaUserCheck,
  FaShieldAlt,
  FaHeart,
  FaGlobeAmericas,
} from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Image */}
          <div className="lg:ml-10 h-full">
            <img
              src="https://media.istockphoto.com/id/2167906375/photo/couple-holding-betel-leaf-along-with-mangalsutra-gracefully-looking-at-each-other.jpg?s=2048x2048&w=is&k=20&c=rrDLLueVa-2CFL2u8esD7A-IDFLAoNhZGVCv-H2DwJA="
              alt="Happy Couple"
              className="rounded-full rounded-tr-none shadow-xl w-[90%] h-[90%] object-cover transform hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Right Side: Content */}
          <div className="space-y-6 mb-12 lg:mb-48">
            <h4 className="text-4xl font-semibold text-pink-600 uppercase tracking-wider">
              About Us
            </h4>
            <p className="text-gray-600 leading-relaxed text-lg">
              Matrilab is a trusted marriage platform dedicated to helping
              individuals find their perfect life partners. We offer tailored
              matrimonial packages, a growing community of verified members, and
              inspiring success stories. We aim to connect hearts and build
              lifelong relationships with a seamless and secure matchmaking
              experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="bg-pink-100 text-pink-600 p-3 rounded-full flex-shrink-0">
                  <FaUserCheck size={22} />
                </div>
                <h5 className="font-semibold text-gray-700">Contact genuine profiles</h5>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-pink-100 text-pink-600 p-3 rounded-full flex-shrink-0">
                  <FaShieldAlt size={22} />
                </div>
                <h5 className="font-semibold text-gray-700">100% security for data and Profile</h5>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-pink-100 text-pink-600 p-3 rounded-full flex-shrink-0">
                  <FaHeart size={22} />
                </div>
                <h5 className="font-semibold text-gray-700">Find perfect match quite easily</h5>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-pink-100 text-pink-600 p-3 rounded-full flex-shrink-0">
                  <FaGlobeAmericas size={22} />
                </div>
                <h5 className="font-semibold text-gray-700">Trusted Matrimonial agency in the world</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;