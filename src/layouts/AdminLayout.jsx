import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/admin/Navbar';
import Sidebar from '../components/admin/Sidebar';

/**
 * AdminLayout - Layout wrapper for all admin pages
 * Contains admin Navbar + Sidebar + content area via Outlet
 */
const AdminLayout = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <Sidebar />
            <main className="pt-24 pl-64">
                <div className="px-6 lg:px-8 py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
