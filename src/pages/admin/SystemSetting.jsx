import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiSettings,
  FiImage,
  FiSliders,
  FiBell,
  FiCreditCard,
  FiGlobe,
  FiLayout,
  FiFileText,
  FiUserCheck,
  FiUsers,
  FiMessageSquare,
  FiShield,
  FiTool,
  FiCode,
} from "react-icons/fi";
import {
  FaPuzzlePiece,
  FaCookieBite,
  FaSitemap,
  FaRobot,
} from "react-icons/fa";

const SystemSetting = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const settings = [
    {
      icon: <FiSettings />,
      title: "General Setting",
      description: "Configure the fundamental information of the site.",
      color: "blue",
    },
    {
      icon: <FiImage />,
      title: "Logo and Favicon",
      description: "Upload your logo and favicon here.",
      color: "green",
    },
    {
      icon: <FiSliders />,
      title: "System Configuration",
      description: "Control all of the basic modules of the system.",
      color: "purple",
    },
    {
      icon: <FiBell />,
      title: "Notification Setting",
      description:
        "Control and configure overall notification elements of the system.",
      color: "red",
    },
    {
      icon: <FiCreditCard />,
      title: "Payment Gateways",
      description:
        "Configure automatic or manual payment gateways to accept payment from users.",
      color: "indigo",
    },
    {
      icon: <FiGlobe />,
      title: "SEO Configuration",
      description:
        "Configure proper meta title, meta description, meta keywords, etc to make the system SEO-friendly.",
      color: "teal",
    },
    {
      icon: <FiLayout />,
      title: "Manage Frontend",
      description: "Control all of the frontend contents of the system.",
      color: "pink",
    },
    {
      icon: <FiFileText />,
      title: "Manage Pages",
      description: "Control dynamic and static pages of the system.",
      color: "orange",
    },
    {
      icon: <FiUserCheck />,
      title: "KYC Setting",
      description:
        "Configure the dynamic input field to collect information of your client if you need.",
      color: "cyan",
    },
    {
      icon: <FiUsers />,
      title: "Social Login Setting",
      description:
        "Provide the required information here to use the login system by social media.",
      color: "yellow",
    },
    {
      icon: <FiMessageSquare />,
      title: "Language",
      description:
        "Configure your required languages and keywords to localize the system.",
      color: "lime",
    },
    {
      icon: <FaPuzzlePiece />,
      title: "Extensions",
      description:
        "Manage extensions of the system here to extend some extra features of the system.",
      color: "gray",
    },
    {
      icon: <FiShield />,
      title: "Policy Pages",
      description: "Configure your policy and terms of the system here.",
      color: "blue",
    },
    {
      icon: <FiTool />,
      title: "Maintenance Mode",
      description:
        "Enable or disable the maintenance mode of the system when required.",
      color: "red",
    },
    {
      icon: <FaCookieBite />,
      title: "GDPR Cookie",
      description:
        "Set GDPR Cookie policy if required. It will ask visitor of the system to accept if enabled.",
      color: "amber",
    },
    {
      icon: <FiCode />,
      title: "Custom CSS",
      description:
        "Write custom css here to modify some styles of frontend of the system if you need to.",
      color: "gray",
    },
    {
      icon: <FaSitemap />,
      title: "Sitemap XML",
      description: "Insert the sitemap XML here to enhance SEO performance.",
      color: "green",
    },
    {
      icon: <FaRobot />,
      title: "Robots txt",
      description:
        "Insert the robots.txt content here to enhance bot web crawlers and instruct them on how to interact with certain areas of the website.",
      color: "purple",
    },
  ];

  const filteredSettings = settings.filter(
    (setting) =>
      setting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const colorClasses = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      border: "border-blue-500",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      border: "border-green-500",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      border: "border-purple-500",
    },
    red: { bg: "bg-red-100", text: "text-red-600", border: "border-red-500" },
    indigo: {
      bg: "bg-indigo-100",
      text: "text-indigo-600",
      border: "border-indigo-500",
    },
    teal: {
      bg: "bg-teal-100",
      text: "text-teal-600",
      border: "border-teal-500",
    },
    pink: {
      bg: "bg-pink-100",
      text: "text-pink-600",
      border: "border-pink-500",
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      border: "border-orange-500",
    },
    cyan: {
      bg: "bg-cyan-100",
      text: "text-cyan-600",
      border: "border-cyan-500",
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      border: "border-yellow-500",
    },
    lime: {
      bg: "bg-lime-100",
      text: "text-lime-600",
      border: "border-lime-500",
    },
    gray: {
      bg: "bg-gray-200",
      text: "text-gray-600",
      border: "border-gray-500",
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      border: "border-amber-500",
    },
  };

  const navigate = useNavigate();

  const routeMap = {
    "General Setting": "/admin/extra/application",
    "Logo and Favicon": "/admin/extra/server",
    "System Configuration": "/admin/extra/cache",
    "Notification Setting": "/admin/users/send-notification",
    "Payment Gateways": "/admin/manage-packages",
    "SEO Configuration": "/admin/system-setting",
    "Manage Frontend": "/admin/extra/application",
    "Manage Pages": "/admin/extra/application",
    "KYC Setting": "/admin/users/kyc-pending",
    "Social Login Setting": "/admin/system-setting",
    Language: "/admin/system-setting",
    Extensions: "/admin/system-setting",
    "Policy Pages": "/admin/extra/report-request",
    "Maintenance Mode": "/admin/extra/server",
    "GDPR Cookie": "/admin/system-setting",
    "Custom CSS": "/admin/system-setting",
    "Sitemap XML": "/admin/system-setting",
    "Robots txt": "/admin/system-setting",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h4 className="text-2xl font-bold text-gray-800">System Settings</h4>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSettings.map((setting, index) => {
          const colors = colorClasses[setting.color] || colorClasses.gray;
          return (
            <div
              key={index}
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate(routeMap[setting.title] || "/admin/system-setting")
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  navigate(routeMap[setting.title] || "/admin/system-setting");
              }}
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 ${colors.border}`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${colors.bg}`}>
                  <span className={`text-2xl ${colors.text}`}>
                    {setting.icon}
                  </span>
                </div>
                <div>
                  <h5 className="text-lg font-bold text-gray-800 mb-1">
                    {setting.title}
                  </h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {setting.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSettings.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            No settings found for "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SystemSetting;
