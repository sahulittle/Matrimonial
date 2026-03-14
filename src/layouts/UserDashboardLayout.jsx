import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/user/DashboardNavbar';
import Sidebar from '../components/user/DashboardSidebar';

/**
 * UserDashboardLayout - Layout wrapper for authenticated user pages
 * Contains user dashboard Navbar + Sidebar + content area via Outlet
 */
const UserDashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="lg:pl-[260px]">
                <main className="pt-24">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserDashboardLayout;
