import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Dashboard from "./component/dashboard/Dashboard.jsx";
import Sidebar from "./component/sidebar/Sidebar";
import ManagePackages from "./component/pages/ManagePackages";
import Religion from "./component/pages/Religion";
import UserDetail from "./component/pages/UserDetail";
import BloodGroup from "./component/pages/BloodGroup";
import MaritalStatus from "./component/pages/MaritalStatus";
import ActiveUsers from "./component/pages/ActiveUsers";
import BannedUsers from "./component/pages/BannedUsers";
import EmailUnverified from "./component/pages/EmailUnverified";
import MobileUnverified from "./component/pages/MobileUnverified";
import KycUnverified from "./component/pages/KycUnverified";
import KycPending from "./component/pages/KycPending";
import AllUsers from "./component/pages/AllUsers";
import SendNotification from "./component/pages/SendNotification";
import Interests from "./component/pages/Interests";
import IgnoredProfile from "./component/pages/IgnoredProfile";
import Reports from "./component/pages/Reports";
import PendingPayments from "./component/pages/PendingPayments";
import ApprovedPayments from "./component/pages/ApprovedPayments";
import SuccessfulPayments from "./component/pages/SuccessfulPayments";
import RejectedPayments from "./component/pages/RejectedPayments";
import InitiatedPayments from "./component/pages/InitiatedPayments";
import AllPayments from "./component/pages/AllPayments";
import PendingTicket from "./component/pages/PendingTicket";
import ClosedTicket from "./component/pages/ClosedTicket";
import AnsweredTicket from "./component/pages/AnsweredTicket";
import SystemSetting from "./component/pages/SystemSetting";
import LoginHistory from "./component/pages/LoginHistory";
import NotificationHistory from "./component/pages/NotificationHistory";
import PurchaseHistory from "./component/pages/PurchaseHistory";
import Application from "./component/pages/Application";
import Server from "./component/pages/Server";
import Cache from "./component/pages/Cache";
import Update from "./component/pages/Update";
import ReportRequest from "./component/pages/ReportRequest";

const Admin = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <Sidebar />
      <main className="pt-24 pl-64">
        <div className="px-6 lg:px-8 py-8">
          <Routes>
            {/* Redirect from /admin to /admin/dashboard */}
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="manage-packages" element={<ManagePackages />} />

            <Route path="user-attribute/religion" element={<Religion />} />
            <Route path="user-attribute/blood-group" element={<BloodGroup />} />
            <Route path="user-attribute/marital-status" element={<MaritalStatus />} />

            <Route path="users/active" element={<ActiveUsers />} />
            <Route path="users/detail/:userId" element={<UserDetail />} />
            <Route path="users/banned" element={<BannedUsers />} />
            <Route path="users/email-unverified" element={<EmailUnverified />} />
            <Route path="users/mobile-unverified" element={<MobileUnverified />} />
            <Route path="users/kyc-unverified" element={<KycUnverified />} />
            <Route path="users/kyc-pending" element={<KycPending />} />
            <Route path="users/all" element={<AllUsers />} />
            <Route path="users/send-notification" element={<SendNotification />} />

            <Route path="interactions/interests" element={<Interests />} />
            <Route path="interactions/ignored-profile" element={<IgnoredProfile />} />
            <Route path="interactions/reports" element={<Reports />} />

            <Route path="payments/pending" element={<PendingPayments />} />
            <Route path="payments/approved" element={<ApprovedPayments />} />
            <Route path="payments/successful" element={<SuccessfulPayments />} />
            <Route path="payments/rejected" element={<RejectedPayments />} />
            <Route path="payments/initiated" element={<InitiatedPayments />} />
            <Route path="payments/all" element={<AllPayments />} />

            <Route path="support/pending" element={<PendingTicket />} />
            <Route path="support/closed" element={<ClosedTicket />} />
            <Route path="support/answered" element={<AnsweredTicket />} />

            <Route path="system-setting" element={<SystemSetting />} />

            <Route path="report/login-history" element={<LoginHistory />} />
            <Route path="report/notification-history" element={<NotificationHistory />} />
            <Route path="report/purchase-history" element={<PurchaseHistory />} />

            <Route path="extra/application" element={<Application />} />
            <Route path="extra/server" element={<Server />} />
            <Route path="extra/cache" element={<Cache />} />
            <Route path="extra/update" element={<Update />} />
            <Route path="extra/report-request" element={<ReportRequest />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Admin