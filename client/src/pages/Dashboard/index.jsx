import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './Layout';
import { useAuth } from '../../contexts/AuthContext';

// Placeholders for sub-pages
const Overview = () => {
    const { user } = useAuth();
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="card">
                    <h3 className="text-lg font-medium text-gray-900">Total Classes</h3>
                    <p className="mt-2 text-3xl font-bold text-primary-600">12</p>
                </div>
                {/* More stats based on role */}
            </div>
        </div>
    );
}

import ManageTrainers from './Admin/ManageTrainers';
import ManageClasses from './Admin/ManageClasses';
import ManageMembers from './Admin/ManageMembers';

import Plans from './Common/Plans';
import MyBookings from './Member/MyBookings';
import ClassBooking from './Member/ClassBooking'; // Reuse this for "Book Classes" view in Member Dashboard?
// Actually sidebar links 'Book Classes' to /dashboard root for member.
// So I should probably put ClassBooking as the Index route for Member.

import Subscription from './Member/Subscription';

const Dashboard = () => {
    const { user } = useAuth();

    // Determine the Index page based on Role
    const getIndexPage = () => {
        if (user?.role === 'admin') return <Overview />;
        if (user?.role === 'trainer') return <ManageClasses />; // Trainers see classes/schedule first
        return <ClassBooking />; // Members see available classes to book first
    };

    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={getIndexPage()} />
                <Route path="trainers" element={<ManageTrainers />} />
                <Route path="classes" element={<ManageClasses />} />
                <Route path="members" element={<ManageMembers />} />
                <Route path="bookings" element={<MyBookings />} />
                <Route path="plans" element={<Plans />} />
                <Route path="subscription" element={<Subscription />} />
            </Route>
        </Routes>
    );
};

export default Dashboard;
