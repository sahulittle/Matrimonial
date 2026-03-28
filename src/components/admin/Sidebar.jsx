import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";
import { MdPayment } from "react-icons/md";
import { RiTeamLine, RiQuestionAnswerLine, RiStackLine } from "react-icons/ri";
import { CgDatabase } from "react-icons/cg";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState("");
  const location = useLocation();

  const navLinks = [
    { to: "/admin/dashboard", icon: <FiGrid size={20} />, text: "Dashboard" },
    {
      text: "Package",
      icon: <FiPackage size={20} />,
      submenu: [
        { to: "/admin/manage-packages", text: "Manage Packages" },
        { to: "/admin/renewlist", text: "Renew List" },
      ],
    },

    {
      text: "Manage Users",
      icon: <FiUsers size={20} />,
      submenu: [
        { to: "/admin/users/active", text: "Active Users" },
        { to: "/admin/users/banned", text: "Banned Users" },
        { to: "/admin/users/email-unverified", text: "Email Unverified" },
        { to: "/admin/users/mobile-unverified", text: "Mobile Unverified" },
        { to: "/admin/users/kyc-unverified", text: "KYC Unverified" },
        { to: "/admin/users/kyc-pending", text: "KYC Pending" },
        { to: "/admin/users/all", text: "All Users" },
        { to: "/admin/users/send-notification", text: "Send Notification" },
      ],
    },
    {
      text: "User Interactions",
      icon: <RiTeamLine size={20} />,
      submenu: [
        { to: "/admin/interactions/interests", text: "Interests" },
        { to: "/admin/interactions/ignored-profile", text: "Ignored Profile" },
        { to: "/admin/interactions/reports", text: "Reports" },
      ],
    },
    {
      text: "Payments",
      icon: <MdPayment size={20} />,
      submenu: [
        { to: "/admin/payments/pending", text: "Pending Payments" },
        { to: "/admin/payments/approved", text: "Approved Payments" },
        { to: "/admin/payments/successful", text: "Successful Payments" },
        { to: "/admin/payments/rejected", text: "Rejected Payments" },
        { to: "/admin/payments/initiated", text: "Initiated Payments" },
        { to: "/admin/payments/all", text: "All Payments" },
      ],
    },
    {
      text: "Support Ticket",
      icon: <RiQuestionAnswerLine size={20} />,
      submenu: [
        { to: "/admin/support/pending", text: "Pending Ticket" },
        { to: "/admin/support/closed", text: "Closed Ticket" },
        { to: "/admin/support/answered", text: "Answered Ticket" },
      ],
    },
    {
      to: "/admin/system-setting",
      icon: <FiSettings size={20} />,
      text: "System Setting",
    },
    {
      text: "Report",
      icon: <FiBarChart2 size={20} />,
      submenu: [
        { to: "/admin/report/login-history", text: "Login History" },
        {
          to: "/admin/report/notification-history",
          text: "Notification History",
        },
        { to: "/admin/report/purchase-history", text: "Purchase History" },
      ],
    },
    {
      text: "Extra",
      icon: <RiStackLine size={20} />,
      submenu: [
        { to: "/admin/extra/application", text: "Application" },
        { to: "/admin/extra/server", text: "Server" },
        { to: "/admin/extra/cache", text: "Cache" },
        { to: "/admin/extra/update", text: "Update" },
        { to: "/admin/extra/report-request", text: "Report & Request" },
      ],
    },
  ];

  const handleDropdownToggle = (text) => {
    setOpenDropdown(openDropdown === text ? "" : text);
  };

  const isSubmenuActive = (submenu) => {
    return submenu.some((item) => location.pathname.startsWith(item.to));
  };

  useEffect(() => {
    const activeDropdown = navLinks.find(
      (link) => link.submenu && isSubmenuActive(link.submenu),
    );
    if (activeDropdown) {
      setOpenDropdown(activeDropdown.text);
    }
  }, [location.pathname]);

  const baseLinkClasses =
    "flex items-center px-6 py-3 text-gray-300 rounded-lg mx-3 my-1 transition-colors duration-200";
  const hoverClasses = "hover:bg-gray-700 hover:text-white";
  const activeClasses = "bg-pink-600 text-white shadow-lg";

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white flex flex-col z-40">
      <div className="h-24 shrink-0"></div>

      <nav className="grow overflow-y-auto pb-4">
        <p className="px-6 py-2 text-xs font-semibold text-gray-400 uppercase">
          Main Menu
        </p>
        <ul>
          {navLinks.map((link) =>
            link.submenu ? (
              <li key={link.text}>
                <button
                  onClick={() => handleDropdownToggle(link.text)}
                  className={`w-full flex justify-between items-center px-6 py-3 text-gray-300 rounded-lg mx-3 my-1 transition-colors duration-200 text-left ${hoverClasses} ${isSubmenuActive(link.submenu) ? "text-white bg-gray-700/50" : ""}`}
                >
                  <div className="flex items-center">
                    <span className="mr-4">{link.icon}</span>
                    <span className="font-medium">{link.text}</span>
                  </div>
                  <FiChevronDown
                    className={`transform transition-transform duration-200 ${openDropdown === link.text ? "rotate-180" : ""}`}
                  />
                </button>
                {openDropdown === link.text && (
                  <ul className="pl-10 mt-1">
                    {link.submenu.map((subItem) => (
                      <li key={subItem.text}>
                        <NavLink
                          to={subItem.to}
                          className={({ isActive: isSubActive }) =>
                            `flex items-center w-full px-4 py-2 text-sm text-gray-400 rounded-lg my-1 transition-colors duration-200 hover:bg-gray-700 hover:text-white ${isSubActive ? "bg-pink-600/80 text-white" : ""}`
                          }
                        >
                          {subItem.text}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={link.text}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `${baseLinkClasses} ${hoverClasses} ${isActive ? activeClasses : ""}`
                  }
                >
                  <span className="mr-4">{link.icon}</span>
                  <span className="font-medium">{link.text}</span>
                </NavLink>
              </li>
            ),
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
