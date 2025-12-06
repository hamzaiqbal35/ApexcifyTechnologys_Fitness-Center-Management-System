import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalMembers: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await adminService.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to load admin stats", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PKR',
        }).format(amount / 100); // Assuming stored in cents/paisa
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>

            {loading ? <p>Loading stats...</p> : (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <h3 className="text-sm font-medium text-blue-100 uppercase">Total Revenue</h3>
                            <p className="text-3xl font-bold mt-2">{formatCurrency(stats.totalRevenue)}</p>
                            <p className="text-xs text-blue-100 mt-1">Lifetime earnings</p>
                        </div>
                        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                            <h3 className="text-sm font-medium text-green-100 uppercase">Monthly Revenue</h3>
                            <p className="text-3xl font-bold mt-2">{formatCurrency(stats.monthlyRevenue)}</p>
                            <p className="text-xs text-green-100 mt-1">This month</p>
                        </div>
                        <div className="card">
                            <h3 className="text-sm font-medium text-gray-500 uppercase">Total Members</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalMembers}</p>
                            <p className="text-xs text-green-600 mt-1 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Active Community
                            </p>
                        </div>
                        <div className="card">
                            <h3 className="text-sm font-medium text-gray-500 uppercase">Active Subscriptions</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeSubscriptions}</p>
                            <p className="text-xs text-blue-600 mt-1 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> Recurring Revenue
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Quick Links */}
                        <div className="card h-full">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Management Quick Links</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/dashboard/members" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                                    <h4 className="font-semibold text-gray-900">Members</h4>
                                    <p className="text-sm text-gray-500">View & Manage</p>
                                </Link>
                                <Link to="/dashboard/trainers" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                                    <h4 className="font-semibold text-gray-900">Trainers</h4>
                                    <p className="text-sm text-gray-500">Staff & Schedules</p>
                                </Link>
                                <Link to="/dashboard/classes" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                                    <h4 className="font-semibold text-gray-900">Classes</h4>
                                    <p className="text-sm text-gray-500">Schedule & Capacity</p>
                                </Link>
                                <Link to="/dashboard/plans" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center pointer-events-none opacity-50">
                                    <h4 className="font-semibold text-gray-900">Plans</h4>
                                    <p className="text-sm text-gray-500">Manage Pricing (Soon)</p>
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity / Logs */}
                        <div className="card h-full">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                                    stats.recentActivity.map((log, index) => (
                                        <div key={index} className="flex items-start text-sm">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-gray-900 font-medium">{log.action}</p>
                                                <p className="text-gray-500">{log.details ? JSON.stringify(log.details).slice(0, 50) : ''}...</p>
                                                <p className="text-xs text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">No recent activity logs.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
