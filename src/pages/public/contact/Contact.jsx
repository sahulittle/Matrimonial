    import React, { useState } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import FrequentQuestion from "../home/FrequentQuestion";
import HowitWork from "../home/HowitWork";
import Testimonial from "../home/Testimonial";
import Footer from "../home/Footer";
import toast from "react-hot-toast";
import api from "../../../services/api";

const Contact = () => {
  const contactInfo = [
    {
      icon: <FaMapMarkerAlt size={30} />,
      title: "Contact Info",
      detail: "401, Vaibhav Park, 64 Bhavani Shankar Rd, Dadar West, Mumbai -400028, Maharashtra, India",
    },
    {
      icon: <FaEnvelope size={30} />,
      title: "Email Address",
      detail: "jodi@marathishubhavivah.com",
    },
    {
      icon: <FaPhoneAlt size={30} />,
      title: "Contact Number",
      detail: "+919769107005",
    },
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // basic validation
      if (!form.name || !form.email || !form.message) {
        toast.error("Please fill name, email and message");
        return;
      }

      await api.post("/users/contact", form);
      toast.success("Message sent successfully");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.message || "Failed to send message");
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-100 py-16 sm:py-20 mt-24">
      <div className="container mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-center">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="text-pink-500 mb-4">{item.icon}</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                {item.title}
              </h4>
              <p className="text-gray-600">{item.detail}</p>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="bg-white rounded-lg shadow-lg p-5 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side: Form */}
          <div>
            <h4 className="text-3xl font-bold text-gray-800 mb-6">
              Get In Touch With Us
            </h4>
            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              <input
                value={form.name}
                onChange={handleChange}
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <input
                value={form.email}
                onChange={handleChange}
                type="email"
                name="email"
                placeholder="Your Email Address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <input
                value={form.subject}
                onChange={handleChange}
                type="text"
                name="subject"
                placeholder="Subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              />
              <textarea
                value={form.message}
                onChange={handleChange}
                name="message"
                rows="5"
                placeholder="Your Message"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              ></textarea>
              <button
                type="submit"
                className="w-full py-3 bg-pink-500 text-white font-bold rounded-lg shadow-md transition hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right Side: Image */}
          <div className="hidden lg:block">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPqSRA2ffH_iOQFIbET6TJcUL7nlH77ZeX4A&s"
              alt="Contact Us"
              className="rounded-lg shadow-xl w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <FrequentQuestion />
      <HowitWork />
      <Testimonial />
      <Footer />
    </div>
  );
};

export default Contact;
