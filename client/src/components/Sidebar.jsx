import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50';
    };

    const adminLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Trainers', path: '/dashboard/trainers' },
        { name: 'Classes', path: '/dashboard/classes' },
        { name: 'Members', path: '/dashboard/members' },
    ];

    const trainerLinks = [
        { name: 'My Schedule', path: '/dashboard' },
        { name: 'Plan Management', path: '/dashboard/plans' },
    ];

    const memberLinks = [
        { name: 'Book Classes', path: '/dashboard' },
        { name: 'My Bookings', path: '/dashboard/bookings' },
        { name: 'My Plans', path: '/dashboard/plans' },
        { name: 'Subscription', path: '/dashboard/subscription' },
    ];

    let links = [];
    if (user?.role === 'admin') links = adminLinks;
    else if (user?.role === 'trainer') links = trainerLinks;
    else links = memberLinks;

    return (
        <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 border-r border-gray-200 bg-white">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
                <Link to="/" className="font-display font-bold text-xl text-primary-600">FitTrack</Link>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive(link.path)}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
