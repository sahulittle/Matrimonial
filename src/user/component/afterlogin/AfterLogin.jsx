import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import ProfileView from './pages/ProfileView'
import Matches from './pages/Matches'
import Search from './pages/Search'
import Interests from './pages/Interests'
import Messages from './pages/Messages'
import Shortlist from './pages/Shortlist'
import Visitors from './pages/Visitors'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import MainLayout from './components/layout/MainLayout'

const AfterLogin = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Default route for /afterlogin */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Main App Routes */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        {/* <Route path="profile/:id" element={<ProfileView />} /> */}
        <Route path="matches" element={<Matches />} />
        <Route path="search" element={<Search />} />
        <Route path="interests" element={<Interests />} />
        <Route path="messages" element={<Messages />} />
        <Route path="shortlist" element={<Shortlist />} />
        <Route path="visitors" element={<Visitors />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />

        {/* Catch-all to redirect to dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default AfterLogin