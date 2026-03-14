import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import UserNavbar from '../components/user/Navbar';
import Preloader from '../components/common/Preloader';

/**
 * UserPublicLayout - Layout wrapper for public-facing user pages
 * Contains user Navbar + Preloader + content area via Outlet
 */
const UserPublicLayout = () => {
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <div>
            {loading ? (
                <Preloader />
            ) : (
                <>
                    <UserNavbar />
                    <main>
                        <Outlet />
                    </main>
                </>
            )}
        </div>
    );
};

export default UserPublicLayout;
