import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import ManagePackages from '../pages/admin/ManagePackages';
import Religion from '../pages/admin/Religion';
import BloodGroup from '../pages/admin/BloodGroup';
import MaritalStatus from '../pages/admin/MaritalStatus';
import ActiveUsers from '../pages/admin/ActiveUsers';
import UserDetail from '../pages/admin/UserDetail';
import BannedUsers from '../pages/admin/BannedUsers';
import EmailUnverified from '../pages/admin/EmailUnverified';
import MobileUnverified from '../pages/admin/MobileUnverified';
import KycUnverified from '../pages/admin/KycUnverified';
import KycPending from '../pages/admin/KycPending';
import AllUsers from '../pages/admin/AllUsers';
import SendNotification from '../pages/admin/SendNotification';
import Interests from '../pages/admin/Interests';
import IgnoredProfile from '../pages/admin/IgnoredProfile';
import Reports from '../pages/admin/Reports';
import PendingPayments from '../pages/admin/PendingPayments';
import ApprovedPayments from '../pages/admin/ApprovedPayments';
import SuccessfulPayments from '../pages/admin/SuccessfulPayments';
import RejectedPayments from '../pages/admin/RejectedPayments';
import InitiatedPayments from '../pages/admin/InitiatedPayments';
import AllPayments from '../pages/admin/AllPayments';
import PendingTicket from '../pages/admin/PendingTicket';
import ClosedTicket from '../pages/admin/ClosedTicket';
import AnsweredTicket from '../pages/admin/AnsweredTicket';
import SystemSetting from '../pages/admin/SystemSetting';
import LoginHistory from '../pages/admin/LoginHistory';
import NotificationHistory from '../pages/admin/NotificationHistory';
import PurchaseHistory from '../pages/admin/PurchaseHistory';
import Application from '../pages/admin/Application';
import Server from '../pages/admin/Server';
import Cache from '../pages/admin/Cache';
import Update from '../pages/admin/Update';
import ReportRequest from '../pages/admin/ReportRequest';

/**
 * AdminRoutes - All admin route definitions
 * Protected: requires user.role === "admin"
 */
const AdminRoutes = () => (
    <Route path="admin" element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
            {/* Redirect /admin → /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="manage-packages" element={<ManagePackages />} />

            {/* User Attributes */}
            <Route path="user-attribute/religion" element={<Religion />} />
            <Route path="user-attribute/blood-group" element={<BloodGroup />} />
            <Route path="user-attribute/marital-status" element={<MaritalStatus />} />

            {/* Users */}
            <Route path="users/active" element={<ActiveUsers />} />
            <Route path="users/detail/:userId" element={<UserDetail />} />
            <Route path="users/banned" element={<BannedUsers />} />
            <Route path="users/email-unverified" element={<EmailUnverified />} />
            <Route path="users/mobile-unverified" element={<MobileUnverified />} />
            <Route path="users/kyc-unverified" element={<KycUnverified />} />
            <Route path="users/kyc-pending" element={<KycPending />} />
            <Route path="users/all" element={<AllUsers />} />
            <Route path="users/send-notification" element={<SendNotification />} />

            {/* Interactions */}
            <Route path="interactions/interests" element={<Interests />} />
            <Route path="interactions/ignored-profile" element={<IgnoredProfile />} />
            <Route path="interactions/reports" element={<Reports />} />

            {/* Payments */}
            <Route path="payments/pending" element={<PendingPayments />} />
            <Route path="payments/approved" element={<ApprovedPayments />} />
            <Route path="payments/successful" element={<SuccessfulPayments />} />
            <Route path="payments/rejected" element={<RejectedPayments />} />
            <Route path="payments/initiated" element={<InitiatedPayments />} />
            <Route path="payments/all" element={<AllPayments />} />

            {/* Support */}
            <Route path="support/pending" element={<PendingTicket />} />
            <Route path="support/closed" element={<ClosedTicket />} />
            <Route path="support/answered" element={<AnsweredTicket />} />

            {/* Settings */}
            <Route path="system-setting" element={<SystemSetting />} />

            {/* Reports */}
            <Route path="report/login-history" element={<LoginHistory />} />
            <Route path="report/notification-history" element={<NotificationHistory />} />
            <Route path="report/purchase-history" element={<PurchaseHistory />} />

            {/* Extra */}
            <Route path="extra/application" element={<Application />} />
            <Route path="extra/server" element={<Server />} />
            <Route path="extra/cache" element={<Cache />} />
            <Route path="extra/update" element={<Update />} />
            <Route path="extra/report-request" element={<ReportRequest />} />

            {/* Catch-all to redirect to dashboard */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
    </Route>
);

export default AdminRoutes;
